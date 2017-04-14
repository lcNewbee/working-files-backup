<?php
namespace Protocols;
class MyJsonInt
{
	/**
     * 检查包的完整性
     * 如果能够得到包长，则返回包的在buffer中的长度，否则返回0继续等待数据
     * 如果协议有问题，则可以返回false，当前客户端连接会因此断开
     * @param string $buffer
     * @return int
     */
    public static function input($buffer)
    {
        // 获得换行字符"\n"位置
        $pos = strpos($buffer, "\n");
        // 没有换行符，无法得知包长，返回0继续等待数据
        if($pos === false)
        {
            return 0;
        }
        // 有换行符，返回当前包长（包含换行符）
        return $pos+1;
    }

    /**
     * 打包，当向客户端发送数据的时候会自动调用
     * @param string $buffer
     * @return string
     */
    public static function encode($buffer)
    {
		// Json编码得到包体
        $body_json_str = json_encode($buffer);
        // 计算整个包的长度，首部4字节+包体字节数
        //$total_length = 4 + strlen($body_json_str);
		$total_length = strlen($body_json_str);
        // 返回打包的数据


		echo "output: 0x" . bin2hex(pack('N',$total_length)) . "\n";
				
        return pack('N',$total_length) . $body_json_str;

		/*
        // json序列化，并加上换行符作为请求结束的标记
        return json_encode($buffer)."\n";
		*/
    }

    /**
     * 解包，当接收到的数据字节数等于input返回的值（大于0的值）自动调用
     * 并传递给onMessage回调函数的$data参数
     * @param string $buffer
     * @return string
     */
    public static function decode($buffer)
    {
        // 去掉换行，还原成数组
        return json_decode(trim($buffer), true);
    }



	/*
    public static function input($recv_buffer)
    {		
        // 接收到的数据还不够4字节，无法得知包的长度，返回0继续等待数据
        if(strlen($recv_buffer)<4)
        {
            return 0;
        }
        // 利用unpack函数将首部4字节转换成数字，首部4字节即为整个数据包长度
        $unpack_data = unpack('Ntotal_length', $recv_buffer);
        return $unpack_data['total_length'];
    }

    public static function decode($recv_buffer)
    {
        // 去掉首部4字节，得到包体Json数据
        $body_json_str = substr($recv_buffer, 4);
        // json解码
        return json_decode($body_json_str, true);
    }

    public static function encode($data)
    {

        // Json编码得到包体
        $body_json_str = json_encode($data);
        // 计算整个包的长度，首部4字节+包体字节数
        $total_length = 4 + strlen($body_json_str);
        // 返回打包的数据
        return pack('N',$total_length) . $body_json_str;
    }
	*/
}