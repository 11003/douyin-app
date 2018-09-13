<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/7/17
 * Time: 15:51
 */

namespace app\Api\controller;

use cmf\controller\HomeBaseController;
use think\Db;
class CateController extends HomeBaseController
{
    public function index()
    {
        $id = input('id');
        $cate=DB::name("portal_desc")->where('id',$id)->order('id DESC')->select();
        echo json_encode($cate);exit;
    }
    public function cate()
    {
    	$userid = $_POST['userid'];
    	if(!$userid){
            echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
        }
        $res = DB::name('portal_category')->order('id DESC')->where('status',1)->select();
        echo json_encode($res);exit;
    }

}