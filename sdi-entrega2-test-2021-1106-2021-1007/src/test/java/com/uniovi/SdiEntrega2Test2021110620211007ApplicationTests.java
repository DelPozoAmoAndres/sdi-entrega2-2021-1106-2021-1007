package com.uniovi;

import org.bson.Document;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.springframework.boot.test.context.SpringBootTest;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

@SpringBootTest
class SdiEntrega2Test2021110620211007ApplicationTests {

	// Rutas para gecko y firefox
	// Sergio
	static String PathFirefox65 = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
	static String Geckdriver024 = "C:\\Users\\sergi\\Documents\\geckodriver024win64.exe";

	static WebDriver driver = getDriver(PathFirefox65, Geckdriver024);
	static String URL = "http://localhost:3000";

	static MongoDatabase db;
	
	public static WebDriver getDriver(String PathFirefox, String Geckdriver) {
		System.setProperty("webdriver.firefox.bin", PathFirefox);
		System.setProperty("webdriver.gecko.driver", Geckdriver);
		WebDriver driver = new FirefoxDriver();
		return driver;
	}

	// Antes de la primera prueba creamos un cliente de mongo
	@BeforeClass
	static public void begin() {
		ConnectionString connString = new ConnectionString(
				"mongodb://admin:admin@cluster0-shard-00-00.mssmg.mongodb.net:27017,cluster0-shard-00-01.mssmg.mongodb.net:27017,cluster0-shard-00-02.mssmg.mongodb.net:27017/MyWallapop?ssl=true&replicaSet=atlas-96ofd9-shard-0&authSource=admin&retryWrites=true&w=majority");
		MongoClientSettings settings = MongoClientSettings.builder().applyConnectionString(connString).retryWrites(true)
				.build();
		MongoClient mongoClient = MongoClients.create(settings);
		db = mongoClient.getDatabase("MyWallapop");

	}

	// Antes de cada prueba se navega al URL home de la aplicación y se reinicia la
	// base de datos
	@Before
	public void setUp() {
		init();
		driver.navigate().to(URL);
	}

	private void init() {
		//Eliminamos las colecciones existentes
		db.getCollection("usuarios").drop();
		db.getCollection("productos").drop();
		
		//Las creamos otra vez para insertar los datos desde cero
		db.createCollection("usuarios");
		db.createCollection("productos");
		
		//Insertamos los usuarios
		Document usuario = new Document().append("email", "admin@email.com").append("password", "ebd5359e500475700c6cc3dd4af89cfd0569aa31724a1bf10ed1e3019dcfdb11").append("rol", "Usuario Administrador");
		db.getCollection("usuarios").insertOne(usuario);
		usuario = new Document().append("email", "sergio@email.com").append("nombre", "Sergio").append("apellidos", "Maté Suárez").append("dinero", 100).append("password", "1cc9619256c0cef03e148a99756c06ccd6364ec63a08fac31e85ffa8276d805e").append("rol", "Usuario Estándar");
		db.getCollection("usuarios").insertOne(usuario);
		usuario = new Document().append("email", "andres@developer.com").append("nombre", "Andres").append("apellidos", "Developer").append("dinero", 100).append("password", "a0fcffb4e8ff04f20c7ac02e890d365d8daf0439098b48d61fb0287fb83856ce").append("rol", "Usuario Estándar");
		db.getCollection("usuarios").insertOne(usuario);
		
		//Insertamos los productos
		Document producto = new Document().append("nombre", "Oferta1").append("descripcion", "Esta es la descripcion de la oferta de prueba").append("precio", 20).append("fecha", "Thu May 06 2021").append("autor", "sergio@email.com");
	}
	

	@Test
	void contextLoads() {
	}

}
