package com.wjw.chat.message.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.context.annotation.Bean;

import com.corundumstudio.socketio.AuthorizationListener;
import com.corundumstudio.socketio.HandshakeData;
import com.corundumstudio.socketio.SocketConfig;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.SpringAnnotationScanner; 
import org.springframework.context.annotation.Configuration;
  
@Configuration
public class SocketIOConfig { 
  @Value("${socketio.host}")
  private String host;

  @Value("${socketio.port}")
  private Integer port;

  @Value("${socketio.bossCount}")
  private int bossCount;

  @Value("${socketio.workCount}")
  private int workCount;

  @Value("${socketio.allowCustomRequests}")
  private boolean allowCustomRequests;

  @Value("${socketio.upgradeTimeout}")
  private int upgradeTimeout;

  @Value("${socketio.pingTimeout}")
  private int pingTimeout;

  @Value("${socketio.pingInterval}")
  private int pingInterval;
    
  @Bean
  public SocketIOServer socketIOServer()  
  { 
    com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration(); 
    config.setHostname(host);
    config.setPort(port);
    SocketConfig socketConfig = new SocketConfig();
    socketConfig.setTcpNoDelay(true);
    socketConfig.setSoLinger(0);
    // if(!socketConfig.isReuseAddress()){
    //   socketConfig.setReuseAddress(true);
    //   System.out.println("是否绑定了: "+socketConfig.isReuseAddress());
    // }
    socketConfig.setReuseAddress(true);
    config.setSocketConfig(socketConfig);
    config.setBossThreads(bossCount);
    config.setWorkerThreads(workCount);
    config.setAllowCustomRequests(allowCustomRequests);
    config.setUpgradeTimeout(upgradeTimeout);
    config.setPingTimeout(pingTimeout);
    config.setPingInterval(pingInterval);
      
    //该处可以用来进行身份验证 
    config.setAuthorizationListener(new AuthorizationListener() { 
      @Override
      public boolean isAuthorized(HandshakeData data) { 
        //http://localhost:8081?username=test&password=test 
        //例如果使用上面的链接进行connect，可以使用如下代码获取用户密码信息，本文不做身份验证 
//       String username = data.getSingleUrlParam("username"); 
//       String password = data.getSingleUrlParam("password"); 
        return true; 
      } 
    }); 
      
    final SocketIOServer server = new SocketIOServer(config); 
    return server; 
  } 
    
  @Bean
  public SpringAnnotationScanner springAnnotationScanner(SocketIOServer socketServer) { 
    return new SpringAnnotationScanner(socketServer); 
  } 
    
  public static void main(String[] args) { 
    SpringApplication.run(SocketIOConfig.class, args); 
  } 
} 