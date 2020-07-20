package com.wjw.chat.message.controller;

import java.util.Date;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import com.wjw.chat.message.entity.CustomerInfo;
import com.wjw.chat.message.entity.MessageInfo;
import com.wjw.chat.message.service.ClientInfoRepository;

@Component
public class MessageEventHandler {
  private final SocketIOServer server;

  @Autowired
  private ClientInfoRepository clientInfoRepository;

  @Autowired
  public MessageEventHandler(final SocketIOServer server) {
    this.server = server;
  }

  // 添加connect事件，当客户端发起连接时调用，本文中将clientid与sessionid存入数据库
  // 方便后面发送消息时查找到对应的目标client,
  @OnConnect
  public void onConnect(final SocketIOClient client) {
    System.out.print("================================"+client.getRemoteAddress().toString()+"================================");
    final String clientId = client.getHandshakeData().getSingleUrlParam("clientid");
    System.out.println("clientId = " + clientId);
    final CustomerInfo customerInfo = clientInfoRepository.findClientByclientid(clientId);
    if (customerInfo != null) {
      final Date nowTime = new Date(System.currentTimeMillis());
      customerInfo.setClientid(clientId);
      customerInfo.setConnected((short) 1);
      customerInfo.setMostsignbits(client.getSessionId().getMostSignificantBits());
      customerInfo.setLeastsignbits(client.getSessionId().getLeastSignificantBits());
      customerInfo.setLastconnecteddate(nowTime);
      clientInfoRepository.save(customerInfo);
    } else {
      CustomerInfo customerInfo2 = new CustomerInfo();
      final Date nowTime = new Date(System.currentTimeMillis());
      customerInfo2.setClientid(clientId);
      customerInfo2.setConnected((short) 1);
      customerInfo2.setMostsignbits(client.getSessionId().getMostSignificantBits());
      customerInfo2.setLeastsignbits(client.getSessionId().getLeastSignificantBits());
      customerInfo2.setLastconnecteddate(nowTime);
      clientInfoRepository.save(customerInfo2);
    }
  }

  // 添加@OnDisconnect事件，客户端断开连接时调用，刷新客户端信息
  @OnDisconnect
  public void onDisconnect(final SocketIOClient client) {
    final String clientId = client.getHandshakeData().getSingleUrlParam("clientid");
    final CustomerInfo customerInfo = clientInfoRepository.findClientByclientid(clientId);
    if (customerInfo != null) {
      customerInfo.setClientid(clientId);
      customerInfo.setConnected((short) 0);
      customerInfo.setMostsignbits(null);
      customerInfo.setLeastsignbits(null);
      clientInfoRepository.save(customerInfo);
    }
  }

  // 消息接收入口，当接收到消息后，查找发送目标客户端，并且向该客户端发送消息，且给自己发送消息
  @OnEvent(value = "messageevent")
  public void onEvent(final SocketIOClient client, final AckRequest request, final MessageInfo data) {
    final String targetClientId = data.getTargetClientId();
    final CustomerInfo customerInfo = clientInfoRepository.findClientByclientid(targetClientId);
    if (customerInfo != null && customerInfo.getConnected() != 0) {
      final UUID uuid = new UUID(customerInfo.getMostsignbits(), customerInfo.getLeastsignbits());
      System.out.println(uuid.toString());
      final MessageInfo sendData = new MessageInfo();
      sendData.setSourceClientId(data.getSourceClientId());
      sendData.setTargetClientId(data.getTargetClientId());
      sendData.setMsgType("chat");
      sendData.setMsgContent(data.getMsgContent());
      // 客户端同时向自己发送一条信息
      client.sendEvent("messageevent", sendData);
      server.getClient(uuid).sendEvent("messageevent", sendData);
    } else {
      
      final UUID uuid = new UUID(5196531895153120637L, -5196531895153120637L);
      System.out.println(uuid.toString());
      System.out.println("targetClientId = " + targetClientId);
      final MessageInfo sendData = new MessageInfo();
      sendData.setSourceClientId(data.getSourceClientId());
      sendData.setTargetClientId(data.getTargetClientId());
      sendData.setMsgType("chat");
      sendData.setMsgContent(data.getMsgContent());
      // 客户端同时向自己发送一条信息
      client.sendEvent("messageevent", sendData);
      server.getClient(uuid).sendEvent("messageevent", sendData);
    }

  }

  @OnEvent(value = "customerto")
  public void onEventCustomerto(final SocketIOClient client, final AckRequest request, final MessageInfo data) {
    final String targetClientId = data.getTargetClientId();
    // CustomerInfo customerInfo =
    // clientInfoRepository.findClientByclientid(targetClientId);
    // if (customerInfo != null && customerInfo.getConnected() != 0)
    // {
    final UUID uuid = new UUID(5196531895153120637L, -5196531895153120637L);
    System.out.println(uuid.toString());
    System.out.println("targetClientId = " + targetClientId);
    final MessageInfo sendData = new MessageInfo();
    sendData.setSourceClientId(data.getSourceClientId());
    sendData.setTargetClientId(data.getTargetClientId());
    sendData.setMsgType("chat");
    sendData.setMsgContent(data.getMsgContent());
    client.sendEvent("messageevent", sendData);
    server.getClient(uuid).sendEvent("messageevent", sendData);
    // }

  }

}