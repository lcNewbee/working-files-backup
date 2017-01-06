<?php
class NetworkPortalMac_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
    function get_portal_white_list(){
        $retdata = array(
            'page' => (int)element('page', $_GET, -1), 
            'size' => (int)element('size', $_GET, -1)
        );        
        $query = $this->db->select('blackwhite_list.*,portal_auth.portal_name')
                        ->from('blackwhite_list')
                        ->join('portal_auth','blackwhite_list.portal_id = portal_auth.id','left')
                        ->get()->result_array();

        $arr = array();
        if(count($query) > 0) {
            foreach ($query as $row) {
                $witeary = $this->get_white_info($row['id']);
                $arr[] = $witeary;
            }
        }
        $ret = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'list'=>$arr
            )
        );
		return json_encode($ret);
    }
    function add_portal_wite($data){
        $result = null;
        $arr = array(
            'template_name'=>$this->get_portal_tmpname($data['interface_bind']),
            'if_name'=>(string)$data['interface_bind'],
            'src_mac'=>(string)$data['src_mac']
        );
        $result = portal_add_template_whitelist(json_encode($arr));
        return $result;
    }
    function del_portal_wite($data) {
        $arr = array();    
        $idary = $data['selectedList'];                 
        foreach($idary as $row) {    
            $lsary = $this->delete_portal_white($row['id']);
            if(is_array($lsary)){           
                $arr[] = $lsary; 
            }
        }
        $cgiary = array('white_list'=>$arr);                          
        $result = portal_del_template_whitelist(json_encode($cgiary));
        return $result;
    }
    function get_white_info($id) {        
        $query = $this->db->select('blackwhite_params.attr_value,blackwhite_attr.attr_name')
                        ->from('blackwhite_params')
                        ->join('blackwhite_attr','blackwhite_params.attr_id=blackwhite_attr.id','left')
                        ->where('blackwhite_params.blackwhite_id',$id)
                        ->get()->result_array();
        $arr = array();
        if(count($query) > 0 ) {
            $arr['id'] = $id;
            foreach($query as $row ) {                
                if( $row['attr_name'] === 'if_name') {
                    $arr['interface_bind'] = $row['attr_value'];
                }
                if( $row['attr_name'] === 'src_mac') {
                    $arr['src_mac'] = $row['attr_value'];
                }                
            }
        }  
        return $arr;                      
    }
    function get_portal_tmpname($v){
        $result = '';
        $querydata = $this->db->select('portal_auth.portal_name')
                            ->from('portalserver_params')
                            ->join('portal_server','portalserver_params.portalserver_id=portal_server.id','left')
                            ->join('portal_auth','portal_server.portal_id = portal_auth.id','left')
                            ->where('portalserver_params.attr_value',$v)
                            ->get()
                            ->result_array();
        if(count($querydata) > 0) {
            $result = $querydata[0]['portal_name'];
        }
        return $result;
    }
    function delete_portal_white($id){
        $result = null;
        $query = $this->db->select('blackwhite_list.rule_id,portal_auth.portal_name')
                            ->from('blackwhite_list')
                            ->join('portal_auth','blackwhite_list.portal_id=portal_auth.id','left')
                            ->where('blackwhite_list.id',$id)
                            ->get()->result_array();
        if( count($query) > 0) {
            $result['template_name'] = $query[0]['portal_name'];
            $result['rule_id'] = (string)$query[0]['rule_id'];            
        }
        return $result;
    }
}