<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/7/19
 * Time: 15:06
 */

namespace app\Api\controller;

use cmf\controller\HomeBaseController;
use think\Db;
class LoginController extends HomeBaseController
{
    /**
     * 获取sessionkeys的接口
     */
    public function getsessionkeys()
    {

        //接收值
        $code = trim($_POST['code']);

        $appid = config('wx.app_id');
        $secret = config('wx.app_secret');


        if(!$code){
            echo json_encode(array('status'=>0,'err'=>'非法操作'));
            exit();
        }

        //接口地址
        $get_token_url = 'https://api.weixin.qq.com/sns/jscode2session?appid='.$appid.'&secret='.$secret.'&js_code='.$code.'&grant_type=authorization_code';
        // $c= file_get_contents($get_token_url);
        // echo $c;die;
        $ch = curl_init();
        curl_setopt($ch,CURLOPT_URL,$get_token_url);
        curl_setopt($ch,CURLOPT_HEADER,0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch,CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        curl_close($ch);
        echo $res;
        exit();
    }

    /**
     * 授权登录接口
     */
    public function authlogin()
    {
        
        $openid = $_POST['openid'];
        if ($openid == 'undefined' || !$openid) {
            echo json_encode(array('status'=>0,'msg'=>'授权失败！'));
            exit();
        }
        $con = array();
        $con['openid'] = trim($openid);
        $userinfo=DB::name("user")->where($con)->find();

        //用户所属id
        $uid = $userinfo['id'];

        if($uid){
            //intval 转整型
            if(intval($userinfo['user_status']) == 0)
            {
                echo json_encode(array('status'=>0,'msg'=>'账号状态异常！'));
                exit();
            }
            // 假设了一个空数组存入小程序字段
            $err = array();
            $err['ID'] = intval($uid);
            $err['NickName'] = $_POST['NickName'];
            $err['HeadUrl'] = $userinfo['avatar']?$userinfo['avatar']:"";
            $err['Gender'] = $_POST['Gender'];
            $err['UserCity'] = $userinfo['user_city'] ? $userinfo['user_city'] :"";
            echo json_encode(array('status'=>1,'msg'=>'登陆成功','arr'=>$err));
            exit();
        }else{
            // 将用户存入数据库
            // data数据库字段一致,POST也要和小程序字段一致
            $data = array();
            $data['user_nickname'] = $_POST['NickName'];
            $data['user_login'] = $_POST['NickName'];
            $data['avatar'] = $_POST['HeadUrl'];
            $data['sex'] = $_POST['Gender'];
            $data['user_city'] = $_POST['UserCity'];
            $data['openid'] = $openid;
            $data['create_time'] = time();
            $data['last_login_time'] = time();

            if (!$data['openid'] || $data['openid']== NULL) {
                echo json_encode(array('status'=>0,'msg'=>'授权失败！'));
                exit();
            }
            DB::name('user')->insert($data);
            // 添加数据后如果需要返回新增数据的自增主键getLastInsID
            $res = Db::name('user')->getLastInsID();
            if($res){
                $err = array();
                $err['ID'] = intval($res);
                $err['NickName'] = $data['user_nickname'];
                $err['HeadUrl'] = $data['avatar'];
                $err['Gender'] = $data['sex'];
                $err['UserCity'] =$data['user_city'];
                echo json_encode(array('status'=>1,'msg'=>'登陆成功','arr'=>$err));
                exit();
            }else{
                echo json_encode(array('status'=>0,'msg'=>'授权失败！'));
                exit();
            }
        }

    }
}