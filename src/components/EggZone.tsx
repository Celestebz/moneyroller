import React, { useEffect, useState } from 'react';

const quotes = [
  '打工是不可能打工的，这辈子都不可能打工的。',
  '工资到账之前，都是雇佣关系。',
  '摸鱼使我快乐，工作使我贫穷。',
  '今天的你也要加油摸鱼哦！',
  '上班如上坟，摸鱼似神仙。',
  '工资没涨，摸鱼不能少。',
  '摸鱼一时爽，一直摸鱼一直爽。',
  '今日废话文学：时间就是金钱，但金钱买不来时间。',
  '摸鱼日报：据说摸鱼的人更有创造力。',
  '“你又赚了￥XX啦～”',
];

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

const EggZone = () => {
  const [visible, setVisible] = useState(true);
  const [quote, setQuote] = useState(getRandomQuote());

  useEffect(() => {
    const timer = setInterval(() => {
      setQuote(getRandomQuote());
    }, 10000); // 每10秒切换一次
    return () => clearInterval(timer);
  }, []);

  if (!visible) {
    return (
      <button className="text-xs text-yellow-500 underline mt-2 hover:text-yellow-700" onClick={() => setVisible(true)}>
        显示摸鱼彩蛋区
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-200 rounded-2xl shadow-lg p-4 my-4 max-w-md w-full flex flex-col items-center border border-yellow-300">
      <button
        className="absolute right-4 top-4 text-xs text-yellow-400 hover:text-yellow-700"
        onClick={() => setVisible(false)}
        title="隐藏"
      >
        隐藏
      </button>
      <div className="text-lg font-bold text-yellow-700 mb-1">摸鱼彩蛋区</div>
      <div className="text-base text-yellow-800">
        {quote}
      </div>
    </div>
  );
};

export default EggZone; 