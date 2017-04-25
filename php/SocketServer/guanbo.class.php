<?php
header('content-type:text/html;charset=utf-8');
use Workerman\Worker;
use Workerman\Lib\Timer;
require_once __DIR__ . '/Workerman/Autoloader.php';
require_once __DIR__ . '/BlackServer.class.php';

$worker = new Worker('MyJsonInt://192.168.100.6:53001');
// 这个例子中进程数必须为1
$worker->count = 1;
// 进程启动时设置一个定时器，定时向所有客户端连接发送数据
$worker->onWorkerStart = function($worker)
{
    // 定时，每10秒一次
    Timer::add(5, function()use($worker)
    {
        // 遍历当前进程所有的客户端连接，发送当前服务器的时间
        foreach($worker->connections as $connection)
        {
            //$connection->send(time().":{'name':'admin'}");
			$black = new BlackServer();
			//MyJsonInt 协议会见数组转换成json
			$arr = $black->start_send(2,1);
			$connection->send($arr);
        }
    });
};
// 运行worker
Worker::runAll();
