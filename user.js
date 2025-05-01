// ==UserScript==
// @name         提取天学网听力答案
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动提取题目正确答案对应的选项内容
// @author       nuym
// @match        *://*.teacher.up366.cn/*
// @grant        GM_addStyle
// ==/UserScript==


// 写在前面,这个网站的开发者也是逆天,网页前端几乎所有功能都是坏掉的,控制台打开嘎嘎全是报错,好一个摸鱼好手.

GM_addStyle(`
    #scanAnswerBtn {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 10px 20px;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        font-size: 14px;
    }
    #scanAnswerBtn:hover {
        background: #1976D2;
    }
`);

(function() {
    'use strict';

    // 创建扫描按钮
    const btn = document.createElement('button');
    btn.id = 'scanAnswerBtn';
    btn.textContent = '提取全部答案';
    document.body.appendChild(btn);

    // 核心扫描函数
    function scanAllQuestions() {
        console.clear();
        console.log('本脚本由nuym开发');
        console.log('开始深度扫描题目...');

        // 查找所有题目容器（包括组合题中的小题）
        const allQuestions = document.querySelectorAll(`
            .u3-questdetail .u3xot-quest-container,
            .u3xot-group-container .u3xot-quest-container
        `);

        if(allQuestions.length === 0) {
            console.warn('⚠ 未找到任何题目');
            return;
        }

        let validCount = 0;
        allQuestions.forEach(question => {
            try {
                // 获取题号（优先从专用元素获取，其次从选项容器获取）
                const questionNumber = question.querySelector('.u3xot-section-no')?.textContent.trim()
                    || [...question.closest('.u3-question__detaillist').querySelectorAll('.report__span')]
                       .find(el => el.textContent.includes('题号'))?.textContent.split(':')[1]?.trim();

                // 获取正确答案
                const answer = question.querySelector('.u3xot-quest-answer-text')?.textContent.trim();

                if(answer && questionNumber) {
                    // 查找对应选项
                    const option = question.querySelector(`.u3xot-quest-option[optionid="${answer}"]`);
                    const optionText = option?.querySelector('.u3xot-quest-option-text')?.textContent.trim();

                    if(optionText) {
                        console.log(`第${questionNumber}题 ${optionText}`);
                        validCount++;
                    }
                }
            } catch (error) {
                console.warn('解析题目时发生错误:', error);
            }
        });

        console.log('扫描完成！共找到 %d 道有效题目', validCount);
        console.log('总题量统计：%d 道题（含无效题目）', allQuestions.length);
    }

    // 绑定点击事件
    btn.addEventListener('click', scanAllQuestions);
})();
