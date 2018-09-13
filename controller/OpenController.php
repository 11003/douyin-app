<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/7/30
 * Time: 16:19
 */

namespace app\Api\controller;


use cmf\controller\HomeBaseController;
use think\Db;
class OpenController extends HomeBaseController
{
    public function index()
    {
        $userid = $_POST['userid'];
        if(!$userid){
            echo json_encode(array('status'=>0,'err'=>'你没有登录.'));
            exit();
        }
        $open=DB::name("portal_open")->order('id DESC')->select();
        echo json_encode($open);exit;
    }
}