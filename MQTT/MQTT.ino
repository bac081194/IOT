#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Arduino_JSON.h>
#include <ESP8266HTTPClient.h>
#include <Servo.h>
#include <DHT.h>

const char* sub1 = "LED";
const char* sub2 = "DOOR";
const char* sub3 = "TEMPERATURE";
const char* sub4 = "HUMIDITY";
#define led1 D4
#define PIR D1

#define DHTPIN D3
#define DHTTYPE DHT11

DHT dht(DHTPIN,DHTTYPE);

const char* mqtt_server = "192.168.1.2";
const int mqtt_port = 1883;
const char* ssid = "604";
const char* password = "21122002";

int servo = D5;
int deg = 0;

Servo myservo;

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  if (strstr(topic, sub1)) {
    Serial.println("Payload: ");
    for (int i = 0; i < length; i++) {
      Serial.print((char)payload[i]);
    }
    Serial.println();
    if ((char)payload[0] == '0') {
      digitalWrite(led1, HIGH);
      Serial.println("RELAY 1 OFF");
    } else {
      digitalWrite(led1, LOW);
      Serial.println("RELAY 1 ON");
    }
  } else if (strstr(topic, sub2)) {
    Serial.println("Payload: ");
    for (int i = 0; i < length; i++) {
      Serial.print((char)payload[i]);
    }
    Serial.println();
    if ((char)payload[0] == '0') {
      myservo.write(0);
      Serial.println("Close door");
    } else {
      myservo.write(180);
      Serial.println("Open door");
    }
  } 
}

void reconnect() {
  while (!client.connected()) {
    Serial.println("Attempting MQTT connection...");
    String clientId = "ESP8266Client";
    clientId += String(random(0xffff), HEX);

    if (client.connect(clientId.c_str())) {
      client.subscribe(sub1);
      client.subscribe(sub2);
      client.subscribe(sub3);
      client.subscribe(sub4);
    } else {
      Serial.println(" try again in 2 seconds");
      delay(1000);
    }
  }
}

void setup() {
  pinMode(led1, OUTPUT);
  pinMode(PIR,INPUT);
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server,mqtt_port);
  client.setCallback(callback);
  digitalWrite(led1,HIGH);
  myservo.attach(servo);
  myservo.write(deg);
}

const char* output(int n){
  return n==0?"0":"1";
}

const char* output(float n){
  Serial.println(n);
  char arr[10];
  sprintf(arr,"%d",n);
  Serial.println(arr);
  return arr;
}
void loop() {

  if(!client.connected()){
    reconnect();
  }
  client.loop();
  Serial.println("---------------------------");
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  Serial.print("Humidity (%): ");
  Serial.println(h, 2);
  Serial.print("Temperature  (C): ");
  Serial.println(t, 2);
  client.publish(sub3,output(t));
  client.publish(sub4,output(h));
  int state = digitalRead(led1);
  Serial.print("led: ");
  Serial.println(state);
  int pirState = digitalRead(PIR);
  
  Serial.println(pirState);
  delay(100);
  if(pirState == HIGH){
    Serial.println("Motion detected");
    delay(100);
  }
  client.publish(sub2,output(pirState));
  Serial.println("---------------------------");
  delay(1000);
}
