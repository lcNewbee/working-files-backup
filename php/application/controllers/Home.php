<?php
defined('BASEPATH') OR exit('No direct script access allowed');

// 前台默认控制器
class Home extends CI_Controller {

	public function index()
	{
    // 给视频分配数据
    $data['title']='我是标题';
    $data['name']=array(
       '张三',
       '李四',
       '马六'
    );

    // $this->load->helper('url'); 放到config的autoload;
    redirect('home/fanny');
    echo site_url;
    echo '<hr/>';
    echo base_url;
		$this->load->view('home', $data);

    // 如果是视图文件后缀名为php，可以不用添加后缀名，其他后缀需要添加
    // $this->load->view('home.html');
	}
    public function fanny()
    {
      echo'Hello Fanny!';
    }

}
?>
