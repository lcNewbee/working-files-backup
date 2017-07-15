<?php
class PortalSocket {
	protected $CI;
	public function __construct() {
		$this->CI =& get_instance();
		$this->CI->load->database();
	}
    /**
     * @data 请求参数 json格式
     * return array
     */
    public function portal_socket($data) {
        $result = null;
        $host    = "127.0.0.1";
        $port    = 55555;
        $socketserver = config_item('portal_socket_info');
        if(count($socketserver) > 0){
            //$host = $socketserver['ip'];
            $host = $_SERVER['SERVER_ADDR'];//获取本机IP
            $port = $socketserver['port'];
        }
        $message = $data ."\n";//PS 要有\n结尾
        // create socket
        $socket = socket_create(AF_INET, SOCK_STREAM, 0) or die("Could not create socket\n");
        // connect to server
        $result = socket_connect($socket, $host, $port) or die("Could not connect to server\n");
        // send string to server
        socket_write($socket, $message, strlen($message)) or die("Could not send data to server\n");
        // get server response
        $result = socket_read ($socket, 102400000) or die("Could not read server response\n");
        /*echo "Reply From Server  :".$result;*/
        // close socket
        socket_close($socket);

        if(is_array(json_decode($result,TRUE))){
            $result = json_decode($result,TRUE);
        }
        return $result;
    }
}
