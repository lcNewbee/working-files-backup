<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class SystemFirewallAttackDefense extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch() {
		$arr = array(
            'xdos_enable' => (int)element('xdos_enable', $_GET),
            'tcp_syn_dos_enable' => (int)element('tcp_syn_dos_enable', $_GET),
            'tcp_syn_limit_per' => (int)element('tcp_syn_limit_per', $_GET),
            'icmp_echo_dos_enable' => (int)element('icmp_echo_dos_enable', $_GET),
            'icmp_echo_request_limit_per' => (int)element('icmp_echo_request_limit_per', $_GET),
            'udp_limit_dos_enable' => (int)element('udp_limit_dos_enable', $_GET),
            'udp_limit_per' => (int)element('udp_limit_per', $_GET),
        );
	  $temp_result = json_decode(axc_get_xdos_param(json_encode($arr)), true);
    $result = array(
            'state' => $temp_result['state'],
            'data' => array(
                'settings' => $temp_result['data'],
            )
        );
    return json_encode($result);
	}
	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
    if ($actionType === 'setting') {
            $arr = array(
              'xdos_enable' => (int)element('xdos_enable', $data),
              'tcp_syn_dos_enable' => (int)element('tcp_syn_dos_enable', $data),
              'tcp_syn_limit_per' => (int)element('tcp_syn_limit_per', $data),
              'icmp_echo_dos_enable' => (int)element('icmp_echo_dos_enable', $data),
              'icmp_echo_request_limit_per' => (int)element('icmp_echo_request_limit_per', $data),
              'udp_limit_dos_enable' => (int)element('udp_limit_dos_enable', $data),
              'udp_limit_per' => (int)element('udp_limit_per', $data),
            );
			$result = axc_set_xdos_conf(json_encode($arr));
		}
		return $result;
	}
	public function index() {
		$result = null;
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
			$result = $this->onAction($data);
			echo $result;
		} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
			$result = $this->fetch();
			echo $result;
		}
	}
}
