<?php
class PHPZip {
	/**          
	 * 解压zip文件
	 * @param String $path --需解压的文件（带路径）/usr/web/mytest.zip
	 * @param String $targetpath --解压文件存放路径 /usr/web/mytest
	 * @return bool --成功/失败
	 */
	function Zip_Decompression($path, $targetpath) {
		$zip = new ZipArchive;
		$res = $zip->open($path);
		if ($res === TRUE) {
			$zip->extractTo($targetpath);
			$zip->close();
			return 1;
		}
		return 0;
	}
	/**          
	 * 将文件夹压缩为zip文件
	 * @param String $path --需压缩的文件夹（带路径） C:\phpStudy\WWW\zip
	 * @param String $targetpath --压缩后文件存放路径 C:\phpStudy\WWW\zip\cccc.zip	
	 * @return bool --成功/失败
	 */
	function Zip_Compress($path, $targetpath) {
		$zip = new ZipArchive();
        if($zip->open($targetpath, ZipArchive::CREATE)=== TRUE){
            //调用方法，对要打包的根目录进行操作，并将ZipArchive的对象传递给方法
			$this->addFileToZip($path, $zip,$path.'/'); 
            $zip->close(); //关闭处理的zip文件
			return 1;
        }
		return 0;		
	}
	/**          
	 * 将文件夹压缩为zip文件 并下载
	 * @param String $path --需压缩的文件夹（带路径） C:\phpStudy\WWW\zip
	 * @param String $targetpath --压缩后文件存放路径 C:\phpStudy\WWW\zip\cccc.zip	
	 * @return bool --成功/失败
	 */
	function Zip_CompressDownload($path, $targetpath) {
		$zip = new ZipArchive();
        if($zip->open($targetpath, ZipArchive::CREATE)=== TRUE){
            //调用方法，对要打包的根目录进行操作，并将ZipArchive的对象传递给方法
			$this->addFileToZip($path, $zip,$path.'/'); 
            $zip->close(); //关闭处理的zip文件
        }
		if(!file_exists($targetpath)){
			echo 'System busy';//系统繁忙
		}
		header("Cache-Control: public"); 
        header("Content-Description: File Transfer"); 
        header('Content-disposition: attachment; filename='.basename($targetpath)); //文件名   
        header("Content-Type: application/zip"); //zip格式的   
        header("Content-Transfer-Encoding: binary"); //告诉浏览器，这是二进制文件    
        header('Content-Length: '. filesize($targetpath)); //告诉浏览器，文件大小   
        @readfile($targetpath); 				
	}
	
	private function addFileToZip($path,$zip,$delpath){
        $handler = opendir($path); //打开当前文件夹由$path指定。            
        while(($filename=readdir($handler))!==false){
            if($filename != "." && $filename != ".."){//文件夹文件名字为'.'和‘..’，不要对他们进行操作				
                if(is_dir($path."/".$filename)){// 如果读取的某个对象是文件夹，则递归	
					$mk = str_replace($delpath, '', $path."/".$filename);
					//添加新目录					
					$zip->addEmptyDir($mk);

                    $this->addFileToZip($path."/".$filename, $zip,$delpath);                    
                }else{ //将文件加入zip对象                    
					$ss = str_replace($delpath, '', $path."/".$filename);
                    $zip->addFile($path."/".$filename,$ss);//第二个参数加上路径后就会按路径生成文件夹，注意！
                }
            }
        }
        @closedir($path);        
    } 
}
