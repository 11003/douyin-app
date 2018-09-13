<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/7/23
 * Time: 15:15
 */

namespace app\Api\controller;


use cmf\controller\HomeBaseController;
use think\Db;
use cmf\lib\Upload;
class UploadController extends HomeBaseController
{
    public function index()
    {
        $user_id=$_POST['userid'];
        if(!$user_id){
            echo json_encode(array('status'=>0,'err'=>'你没有登录.'));
            exit();
        }
        $uploader = new Upload();
        $result = $uploader->upload();
        if ($result === false) {
            echo json_encode(array('status'=>0,'err'=>'上传失败.'));
            exit();
        } else {
            echo json_encode(array('status'=>1,'err'=>'上传成功.',"code"=>$result['url']));
            exit();
        }
//        $file = request()->file('file');
//        if($file){
//            $info = $file->move(ROOT_PATH . 'public' . DS . 'upload'. '/' .'default');
//            if($info){
//                $result = [
//                    'url' =>  __DATAURL__.date('Ymd').'/'.$info->getFilename() //视频地址[__VIDEOURL__]
//                ];
//                if($result === false){
//                    echo json_encode(array('status'=>0,'err'=>'上传失败.'));
//                    exit();
//                }else{
//                    echo json_encode(array('status'=>1,'err'=>'上传成功.',"code"=>$result['url']));
//                    exit();
//                }
//            }else{
//                // 上传失败获取错误信息
//                echo json_encode(array('status'=>0,'err'=>'文件类型错误.'));
//                exit();
//            }
//        }
    }
}