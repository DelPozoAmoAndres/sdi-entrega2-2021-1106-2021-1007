package com.uniovi;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.springframework.boot.test.context.SpringBootTest;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import com.uniovi.pageobjects.PO_ChatView;
import com.uniovi.pageobjects.PO_LoginView;
import com.uniovi.pageobjects.PO_RegisterView;
import com.uniovi.pageobjects.PO_UserView;

//Ordenamos las pruebas por el nombre del método
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@SpringBootTest
public class SdiEntrega2Test2021110620211007ApplicationTests {

	// Rutas para gecko y firefox
	// Sergio
	static String PathFirefox65 = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
	static String Geckdriver024 = "C:\\Users\\sergi\\Documents\\geckodriver024win64.exe";

	// Rutas Andres.
//	static String PathFirefox65 = "C:\\Program Files (x86)\\Mozilla Firefox2\\firefox.exe";
//	static String Geckdriver024 = "C:\\Users\\ANDRES_JR\\Documents\\UNIOVI\\SDI\\LABS\\geckodriver.exe";

	static WebDriver driver = getDriver(PathFirefox65, Geckdriver024);
	static String URL = "https://localhost:3000/";

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

	// Antes de cada prueba se navega al URL home de la aplicacion y se reinicia la
	// base de datos
	@Before
	public void setUp() {
		init();
		driver.navigate().to(URL);
	}

	// Después de cada prueba se borran las cookies del navegador
	@After
	public void tearDown() {
		driver.manage().deleteAllCookies();
	}

	// Al finalizar la última prueba
	@AfterClass
	static public void end() {
		// Cerramos el navegador al finalizar las pruebas
		driver.quit();
		//Reseteamos la BD para poder trabajar en el desarollo despues
		init(); 
	}

	private static void init() {
		// Eliminamos las colecciones existentes
		db.getCollection("usuarios").drop();
		db.getCollection("productos").drop();
		db.getCollection("conversaciones").drop();
		db.getCollection("mensajes").drop();

		// Las creamos otra vez para insertar los datos desde cero
		db.createCollection("usuarios");
		db.createCollection("productos");

		// Insertamos los usuarios
		Document usuario = new Document().append("email", "admin@email.com")
				.append("password", "ebd5359e500475700c6cc3dd4af89cfd0569aa31724a1bf10ed1e3019dcfdb11")
				.append("rol", "Usuario Administrador");
		db.getCollection("usuarios").insertOne(usuario);
		usuario = new Document().append("email", "sergio@email.com").append("nombre", "Sergio")
				.append("apellidos", "Mate Suarez").append("dinero", 80)
				.append("password", "1cc9619256c0cef03e148a99756c06ccd6364ec63a08fac31e85ffa8276d805e")
				.append("rol", "Usuario Estandar");
		db.getCollection("usuarios").insertOne(usuario);
		usuario = new Document().append("email", "andres@developer.com").append("nombre", "Andres")
				.append("apellidos", "Developer").append("dinero", 60)
				.append("password", "1cc9619256c0cef03e148a99756c06ccd6364ec63a08fac31e85ffa8276d805e")
				.append("rol", "Usuario Estandar");
		db.getCollection("usuarios").insertOne(usuario);
		usuario = new Document().append("email", "prueba@developer.com").append("nombre", "Prueba")
				.append("apellidos", "Developer").append("dinero", 100)
				.append("password", "1cc9619256c0cef03e148a99756c06ccd6364ec63a08fac31e85ffa8276d805e")
				.append("rol", "Usuario Estandar");
		db.getCollection("usuarios").insertOne(usuario);

		// Insertamos los productos
		Document producto = new Document().append("nombre", "Oferta1")
				.append("descripcion", "Esta es la descripcion de la oferta de prueba1").append("precio", 20)
				.append("fecha", "Thu May 06 2021").append("autor", "sergio@email.com");
		Document producto1 = new Document().append("nombre", "Oferta2")
				.append("descripcion", "Esta es la descripcion de la oferta de prueba2").append("precio", 20)
				.append("fecha", "Thu May 06 2021").append("autor", "sergio@email.com");
		Document producto2 = new Document().append("nombre", "Oferta3")
				.append("descripcion", "Esta es la descripcion de la oferta de prueba3").append("precio", 20)
				.append("fecha", "Thu May 06 2021").append("autor", "andres@developer.com");
		Document producto3 = new Document().append("nombre", "Oferta4")
				.append("descripcion", "Esta es la descripcion de la oferta de prueba4").append("precio", 20)
				.append("fecha", "Thu May 06 2021").append("autor", "andres@developer.com");
		;
		Document producto4 = new Document().append("nombre", "Oferta5")
				.append("descripcion", "Esta es la descripcion de la oferta de prueba5").append("precio", 20)
				.append("fecha", "Thu May 06 2021").append("autor", "sergio@email.com");
		Document producto5 = new Document().append("nombre", "Oferta6")
				.append("descripcion", "Esta es la descripcion de la oferta de prueba6").append("precio", 20)
				.append("fecha", "Thu May 06 2021").append("autor", "sergio@email.com");
		Document producto6 = new Document().append("nombre", "Oferta7")
				.append("descripcion", "Esta es la descripcion de la oferta de prueba7").append("precio", 20)
				.append("fecha", "Thu May 06 2021").append("autor", "andres@developer.com");
		Document producto7 = new Document().append("nombre", "Oferta8")
				.append("descripcion", "Esta es la descripcion de la oferta de prueba8").append("precio", 20)
				.append("fecha", "Thu May 06 2021").append("autor", "andres@developer.com");
		db.getCollection("productos").insertOne(producto);
		db.getCollection("productos").insertOne(producto1);
		db.getCollection("productos").insertOne(producto2);
		db.getCollection("productos").insertOne(producto3);
		db.getCollection("productos").insertOne(producto4);
		db.getCollection("productos").insertOne(producto5);
		db.getCollection("productos").insertOne(producto6);
		db.getCollection("productos").insertOne(producto7);

	}

	@Test
	public void Prueba01() {
		// Rellenamos el formulario de registro con datos correctos
		PO_RegisterView.register(driver, "nuevo@email.com", "nuevo", "usuario", "contraseña", "contraseña");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_RegisterView.expectingText(driver, "Vista de usuario");
	}

	@Test
	public void Prueba02() {
		// Rellenamos el formulario de registro con datos incorrectos (email, nombre y
		// apellidos vacios)
		PO_RegisterView.register(driver, " ", " ", " ", "contraseña", "contraseña");
		// Comprobamos que no hemos entrado en la pagina de inicio
		PO_RegisterView.error(driver, "Email está vacio");

		// Rellenamos el formulario de registro con datos incorrectos (nombre y
		// apellidos vacios)
		PO_RegisterView.register(driver, "nuevo@email.com", " ", " ", "contraseña", "contraseña");
		// Comprobamos que no hemos entrado en la pagina de inicio
		PO_RegisterView.error(driver, "Nombre está vacio");

		// Rellenamos el formulario de registro con datos incorrectos (apellidos vacios)
		PO_RegisterView.register(driver, "nuevo@email.com", "Nombre", " ", "contraseña", "contraseña");
		// Comprobamos que no hemos entrado en la pagina de inicio
		PO_RegisterView.error(driver, "Apellidos está vacio");
	}

	@Test
	public void Prueba03() {
		// Rellenamos el formulario de registro con datos incorrectos (las contraseñas
		// no coinciden)
		PO_RegisterView.register(driver, "nuevo@email.com", "nuevo", "usuario", "contraseña", "contraseñaIncorrecta");
		// Comprobamos que no hemos entrado en la pagina de inicio
		PO_RegisterView.error(driver, "No coinciden las contraseñas");
	}

	@Test
	public void Prueba04() {
		// Rellenamos el formulario de registro con datos incorrectos (las contraseñas
		// no coinciden)
		PO_RegisterView.register(driver, "sergio@email.com", "nuevo", "usuario", "contraseña", "contraseña");
		// Comprobamos que no hemos entrado en la pagina de inicio
		PO_RegisterView.error(driver, "Email ya usado");
	}

	@Test
	public void Prueba05() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "sergio@email.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");

		// Nos deslogeamos
		PO_LoginView.logout(driver);

		// Nos logeamos como administrador
		PO_LoginView.login(driver, "admin@email.com", "admin");
		// Comprobamos que hemos entrado en la pagina de inicio de admin
		PO_LoginView.checkHome(driver, "Vista de administrador");
	}

	@Test
	public void Prueba06() {
		// Rellenamos el formulario de registro con datos incorrectos (email existente,
		// pero contraseña incorrecta)
		PO_LoginView.login(driver, "sergio@email.com", "11111111");
		// Comprobamos que no hemos entrado en la pagina de inicio
		PO_LoginView.checkNotLoged(driver);
		PO_LoginView.error(driver, "Email o password incorrecto");
	}

	@Test
	public void Prueba07() {
		// Rellenamos el formulario de registro con datos incorrectos (campo email o
		// contraseña vacíos)
		PO_LoginView.login(driver, "sergio@email.com", "         ");
		// Comprobamos que no hemos entrado en la pagina de inicio
		PO_LoginView.checkNotLoged(driver);
		PO_LoginView.error(driver, "Email o password incorrecto");
	}

	@Test
	public void Prueba08() {
		// Rellenamos el formulario de registro con datos incorrectos (email inexistente)
		PO_LoginView.login(driver, "inexistente@email.com", "00000000");
		// Comprobamos que no hemos entrado en la pagina de inicio
		PO_LoginView.checkNotLoged(driver);
		PO_LoginView.error(driver, "Email o password incorrecto");
	}

	@Test
	public void Prueba09() {
		PO_LoginView.login(driver, "sergio@email.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");

		// Nos deslogeamos
		PO_LoginView.logout(driver);
		// Comprobamos que estamos en la pagina de login y que los botones de login y de
		// registro estan disponibles
		PO_LoginView.checkHome(driver, "Identificación de usuario");
		PO_LoginView.checkNotLoged(driver);
	}

	@Test
	public void Prueba10() {
		// De mano no estamos logeados, por lo que comprobamos que los botones de login
		// y de registro estan disponibles pero no el de logout
		PO_LoginView.checkNotLoged(driver);
		PO_LoginView.checkNoLogoutBut(driver);
	}

	@Test
	public void Prueba11() {
		// Nos logeamos como administrador
		PO_LoginView.login(driver, "admin@email.com", "admin");
		// Comprobamos que hemos entrado en la pagina de inicio de admin
		PO_LoginView.checkHome(driver, "Vista de administrador");

		// Comprobamos que los usuarios de la BD estan en la lista
		PO_UserView.checkUsuario(driver, "Sergio", "Mate Suarez", "sergio@email.com");
		PO_UserView.checkUsuario(driver, "Andres", "Developer", "andres@developer.com");
		PO_UserView.checkUsuario(driver, "Prueba", "Developer", "prueba@developer.com");
	}

	@Test
	public void Prueba12() {
		// Nos logeamos como administrador
		PO_LoginView.login(driver, "admin@email.com", "admin");
		// Comprobamos que hemos entrado en la pagina de inicio de admin
		PO_LoginView.checkHome(driver, "Vista de administrador");

		// Eliminamos el primer usuario y vemos que ya no esta en la lista
		PO_UserView.selectUser(driver, 1);
		PO_UserView.deleteUsers(driver);
		PO_UserView.checkNotUsuario(driver, "sergio@email.com");
	}

	@Test
	public void Prueba13() {
		// Nos logeamos como administrador
		PO_LoginView.login(driver, "admin@email.com", "admin");
		// Comprobamos que hemos entrado en la pagina de inicio de admin
		PO_LoginView.checkHome(driver, "Vista de administrador");

		// Eliminamos el ultimo usuario y vemos que ya no esta en la lista
		PO_UserView.selectUser(driver, 3);
		PO_UserView.deleteUsers(driver);
		PO_UserView.checkNotUsuario(driver, "prueba@developer.com");
	}

	@Test
	public void Prueba14() {
		// Nos logeamos como administrador
		PO_LoginView.login(driver, "admin@email.com", "admin");
		// Comprobamos que hemos entrado en la pagina de inicio de admin
		PO_LoginView.checkHome(driver, "Vista de administrador");

		// Eliminamos tres usuarios y vemos que ya no estan en la lista
		PO_UserView.selectUser(driver, 1);
		PO_UserView.selectUser(driver, 2);
		PO_UserView.selectUser(driver, 3);
		PO_UserView.deleteUsers(driver);
		PO_UserView.checkNotUsuario(driver, "sergio@email.com");
		PO_UserView.checkNotUsuario(driver, "andres@developer.com");
		PO_UserView.checkNotUsuario(driver, "prueba@developer.com");
	}

	@Test
	public void Prueba15() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "sergio@email.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");
		// Vamos al formulario de a�adir productos y lo rellenamos con datos validos
		PO_UserView.addProduct(driver, "Titulo1", "DescripcionDescripcion1", "2", false);
		// Checkeamos que se ha creado correctamente el producto
		PO_UserView.expectingText(driver, "Lista de ofertas propias");
	}

	@Test
	public void Prueba16() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "andres@developer.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");
		// Vamos al formulario de a�adir productos y lo rellenamos con datos validos
		PO_UserView.addProduct(driver, " ", "Descripcion1", "-1", false);
		// Checkeamos que se ha producido un error
		PO_UserView.error(driver, "Hay algún campo vacío");
	}

	@Test
	public void Prueba17() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "andres@developer.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");
		// Comprobamos que se muestra correctamente la lista de productos
		String[] titulos = { "Oferta3", "Oferta4", "Oferta7", "Oferta8" };
		PO_UserView.checkListProducts(driver, titulos);
	}

	@Test
	public void Prueba18() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "andres@developer.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");
		// Eliminamos el primer producto de la lista
		PO_UserView.deleteProduct(driver, "Oferta3");
		// Checkeamos que estamos en el listado de ofertas
		PO_UserView.expectingText(driver, "Lista de ofertas propias");
		// Comprobamos que se ha eliminado
		PO_UserView.checkNoProduct(driver, "Oferta3");

	}

	@Test
	public void Prueba19() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "andres@developer.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");
		// Eliminamos el primer producto de la lista
		PO_UserView.deleteProduct(driver, "Oferta8");
		// Checkeamos que estamos en el listado de ofertas
		PO_UserView.expectingText(driver, "Lista de ofertas propias");
		// Comprobamos que se ha eliminado
		PO_UserView.checkNoProduct(driver, "Oferta8");
	}

	@Test
	public void Prueba20() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "andres@developer.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");
		// Ir a la tienda
		PO_UserView.goShopping(driver);
		// buscar campo vacio
		PO_UserView.searchTitle(driver, " ");
		// comprobamos que se ven todos los titulos
		String[] titulos = { "Oferta1", "Oferta2", "Oferta5", "Oferta6" };
		PO_UserView.checkListProducts(driver, titulos);
	}

	@Test
	public void Prueba21() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "andres@developer.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");
		// Ir a la tienda
		PO_UserView.goShopping(driver);
		// buscar campo que no coincida con ningun producto
		PO_UserView.searchTitle(driver, "asdasdasd");
		// comprobamos que no se ven los titulos
		PO_UserView.checkNoProduct(driver, "descripcion");
	}

	@Test
	public void Prueba22() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "andres@developer.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");
		// Ir a la tienda
		PO_UserView.goShopping(driver);
		// buscar campo mayus y minus con coincidencia
		PO_UserView.searchTitle(driver, "OfErTa1");
		// comprobamos que se ve el titulo
		String[] titulo = { "Oferta1" };
		PO_UserView.checkListProducts(driver, titulo);
	}

	@Test
	public void Prueba23() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "andres@developer.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");
		// Ir a la tienda
		PO_UserView.goShopping(driver);
		// buscar campo mayus y minus con coincidencia
		PO_UserView.searchTitle(driver, "OfErTa1");
		// compramos el producto y comprobamos si se actuliza el saldo
		PO_UserView.comprarProducto(driver, "Oferta1", 20);

	}

	@Test
	public void Prueba24() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "andres@developer.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");
		// Ir a la tienda
		PO_UserView.goShopping(driver);
		// compramos el producto y comprobamos si se actuliza el saldo
		PO_UserView.comprarProducto(driver, "Oferta1", 20);
		// Ir a la tienda
		PO_UserView.goShopping(driver);
		// compramos el producto y comprobamos si se actuliza el saldo
		PO_UserView.comprarProducto(driver, "Oferta2", 20);
		// Ir a la tienda
		PO_UserView.goShopping(driver);
		// compramos el producto y comprobamos si se actuliza el saldo
		PO_UserView.comprarProducto(driver, "Oferta5", 20);
	}

	@Test
	public void Prueba25() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "andres@developer.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");
		// Ir a la tienda
		PO_UserView.goShopping(driver);
		// compramos el producto y comprobamos si se actuliza el saldo
		PO_UserView.comprarProducto(driver, "Oferta1", 20);
		// Ir a la tienda
		PO_UserView.goShopping(driver);
		// compramos el producto y comprobamos si se actuliza el saldo
		PO_UserView.comprarProducto(driver, "Oferta2", 20);
		// Ir a la tienda
		PO_UserView.goShopping(driver);
		// compramos el producto y comprobamos si se actuliza el saldo
		PO_UserView.comprarProducto(driver, "Oferta5", 20);
		// Ir a la tienda
		PO_UserView.goShopping(driver);
		// compramos el producto y comprobamos si se actuliza el saldo
		PO_UserView.comprarProducto(driver, "Oferta5", 20);
	}

	@Test
	public void Prueba26() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "andres@developer.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");
		// Ir a la tienda
		PO_UserView.goShopping(driver);
		// compramos el producto y comprobamos si se actuliza el saldo
		PO_UserView.comprarProducto(driver, "Oferta1", 20);
		// ir a compradas
		PO_UserView.goToBuyed(driver);
		// comprobamos que se ve el titulo
		String[] titulo = { "Oferta1" };
		PO_UserView.checkListProducts(driver, titulo);

	}

	@Test
	public void Prueba27() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "andres@developer.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");
		// Vamos al formulario de añadir productos y lo rellenamos con datos validos
		PO_UserView.addProduct(driver, "Titulo1", "DescripcionDescripcion1", "2", true);
		// Checkeamos estado destacada en el buscador
		PO_UserView.expectingText(driver, "Destacada");
		// Nos deslogueamos
		PO_LoginView.logout(driver);
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "sergio@email.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");
		// Ir a la tienda
		PO_UserView.goShopping(driver);
		// buscar campo que no coincida con ningun producto
		PO_UserView.searchTitle(driver, "asdasdasd");
		// comprobamos que está el producto
		String[] titulos = { "Titulo1" };
		PO_UserView.checkListProducts(driver, titulos);

	}

	@Test
	public void Prueba28() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "andres@developer.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");
		// Marco en destacar un producto y comprobamos que se ha realizado correctamente
		PO_UserView.distingProduct(driver, "Oferta3");

	}

	@Test
	public void Prueba29() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.login(driver, "andres@developer.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Vista de usuario");
		// Marco en destacar un producto y comprobamos que se ha realizado correctamente
		PO_UserView.distingProduct(driver, "Oferta3");
		// Marco en destacar un producto y comprobamos que se ha realizado correctamente
		PO_UserView.distingProduct(driver, "Oferta4");
		// Marco en destacar un producto y comprobamos que se ha realizado correctamente
		PO_UserView.distingProduct(driver, "Oferta7");
		// Marco en destacar un producto y comprobamos que no se ha realizado
		// correctamente
		PO_UserView.distingProduct(driver, "Oferta8");
	}

	@Test
	public void Prueba30() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.loginAPI(driver, "sergio@email.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Tienda");
	}

	@Test
	public void Prueba31() {
		// Rellenamos el formulario de registro con datos incorrectos (email existente,
		// pero contraseña incorrecta)
		PO_LoginView.loginAPI(driver, "sergio@email.com", "11111111");
		// Comprobamos que no hemos entrado en la pagina de inicio
		PO_LoginView.error(driver, "Usuario no encontrado");
	}

	@Test
	public void Prueba32() {
		// Rellenamos el formulario de registro con datos incorrectos (campo email o
		// contraseña vacíos)
		PO_LoginView.loginAPI(driver, "sergio@email.com", "         ");
		// Comprobamos que no hemos entrado en la pagina de inicio
		PO_LoginView.error(driver, "Usuario no encontrado");
	}
	
	@Test
	public void Prueba33() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.loginAPI(driver, "andres@developer.com", "00000000");
		// Comprobamos que hemos entrado en la pagina de inicio
		PO_LoginView.checkHome(driver, "Tienda");
		// Comprobamos que se muestra correctamente la lista de productos
		String[] titulos = { "Oferta1", "Oferta2", "Oferta5", "Oferta6" };
		PO_UserView.checkListProducts(driver, titulos);
		//Comprobamos que no salen los productos del usuario registrado
		String[] titulosUsuario = { "Oferta3", "Oferta4", "Oferta7", "Oferta8" };
		for (String titulo : titulosUsuario)
			PO_UserView.checkNoProduct(driver, titulo);
	}
	
	@Test
	public void Prueba34() {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.loginAPI(driver, "andres@developer.com", "00000000");
		PO_LoginView.checkHome(driver, "Tienda");
		//Hacemoss una busqueda
		PO_UserView.searchAndGoToChatAPI(driver, "Oferta1");
		PO_LoginView.checkHome(driver, "Mensaje");
		//Enviamos un mensaje a la oferta
		String texto = "Texto de prueba";
		PO_ChatView.sendMessageAPI(driver, texto);
		//Comprobamos que se ha enviado
		PO_ChatView.checkMessage(driver, texto);
	}
	
	@Test
	public void Prueba35() {
		//Primero enviamos unos cuantos mensajes con otra cuenta para poder verlos despues
		String texto1 = "prueba1";
		String texto2 = "prueba2";
		PO_ChatView.sendSomeMessagesAPI(driver, texto1);
		PO_ChatView.sendSomeMessagesAPI(driver, texto2);
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.loginAPI(driver, "andres@developer.com", "00000000");
		PO_LoginView.checkHome(driver, "Tienda");
		//Vamos a la vista de las conversaciones abiertas
		PO_ChatView.goToChatsAPI(driver);
		PO_LoginView.checkHome(driver, "Chatear");
		//Vamos al primer chat ya abierto
		PO_ChatView.viewChat(driver);
		//Comprobamos que se han enviado los mensajes desde el otro usuario
		PO_ChatView.checkMessage(driver, texto1);
		PO_ChatView.checkMessage(driver, texto2);
		//Enviamos un mensaje a la oferta
		String texto = "Texto de prueba";
		PO_ChatView.sendMessageAPI(driver, texto);
		//Comprobamos que se ha enviado
		PO_ChatView.checkMessage(driver, texto);
	}
	
	@Test 
	public void Prueba36() {
		//Primero enviamos unos cuantos mensajes con otra cuenta para poder verlos despues
		String texto1 = "prueba1";
		String texto2 = "prueba2";
		PO_ChatView.sendSomeMessagesAPI(driver, texto1);
		PO_ChatView.sendSomeMessagesAPI(driver, texto2);
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.loginAPI(driver, "andres@developer.com", "00000000");
		PO_LoginView.checkHome(driver, "Tienda");
		//Vamos a la vista de las conversaciones abiertas
		PO_ChatView.goToChatsAPI(driver);
		PO_LoginView.checkHome(driver, "Oferta3");
	}

}
