<?php
class News extends CI_Controller {

	public function view($news = 'home')
	    {
		if ( ! file_exists(APPPATH.'views/pages/'.$page.'.php'))
		    {
			// 			Whoops, we don't have a page for that!
        show_404();
    }
    $data['title'] = ucfirst($page); // Capitalize the first letter
    $this->load->view('templates/header', $data);
    $this->load->view('pages/'.$page, $data);
    $this->load->view('templates/footer', $data);
    }
    public function __construct()
    {
        parent::__construct();
        $this->load->model('news_model');
        $this->load->helper('url_helper');
    }

    public function index()
    {
        $data['news'] = $this->news_model->get_news();
    }

    public function view ($slug = NULL)
    {
        $data['news_item'] = $this->news_model->get_news($slug);
    }
}
?>
