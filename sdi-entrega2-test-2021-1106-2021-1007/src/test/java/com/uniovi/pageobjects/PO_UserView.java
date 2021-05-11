package com.uniovi.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.utils.SeleniumUtils;

public class PO_UserView extends PO_View {

	static void fillForm(WebDriver driver, String titulop, String descripcionp, String preciop, boolean destacadap) {
		WebElement titulo = driver.findElement(By.name("nombre"));
		titulo.click();
		titulo.clear();
		titulo.sendKeys(titulop);
		WebElement descripcion = driver.findElement(By.name("descripcion"));
		descripcion.click();
		descripcion.clear();
		descripcion.sendKeys(descripcionp);
		WebElement lastname = driver.findElement(By.name("precio"));
		lastname.click();
		lastname.clear();
		lastname.sendKeys(preciop);
		WebElement destacada = driver.findElement(By.name("destacar"));
		if(destacadap)
			destacada.click();
		// Pulsar el boton de Alta.
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}
	
	static public void addProduct(WebDriver driver, String titulo, String descripcion, String precio, boolean destacada){
		driver.findElement(By.name("add")).click();
		fillForm(driver, titulo, descripcion, precio, destacada);
	}
	static public void deleteProduct(WebDriver driver, String titulo){
		driver.findElement(By.name(titulo)).click();
	}
	static public void goShopping(WebDriver driver){
		driver.findElement(By.id("mTienda")).click();
	}
	static public void goToBuyed(WebDriver driver){
		driver.findElement(By.id("mCompras")).click();
	}
	static public void checkListProducts(WebDriver driver, String[] titulos) {
		for(String titulo : titulos) {
			PO_View.checkElement(driver, "text", titulo);
		}
	}
	static public void checkNoProduct(WebDriver driver, String titulo) {
		SeleniumUtils.textoNoPresentePagina(driver, titulo);
	}
	
	static public void searchTitle(WebDriver driver, String titulop) {
		WebElement titulo = driver.findElement(By.name("busqueda"));
		titulo.click();
		titulo.clear();
		titulo.sendKeys(titulop);
		By boton = By.name("lupa");
		driver.findElement(boton).click();
	}
	
	static public void comprarProducto(WebDriver driver, String titulop, int precio) {
		 int saldo=Integer.valueOf(driver.findElement(By.name("saldo")).getText().replace("€", ""));
		 driver.findElement(By.name("comprar")).click();
		 try {
			 PO_View.checkElement(driver, "text", String.valueOf(saldo-precio));
		 }catch(Exception e) {
			 PO_View.checkElement(driver, "text", "No tienes suficiente saldo");
		 }
	}
	
	
	static public void error(WebDriver driver, String errorText) {
		PO_View.checkElement(driver, "text", errorText);
	}
	
	static public void expectingText(WebDriver driver, String expectingText) {
		PO_View.checkElement(driver, "text", expectingText);
	}

    static public void checkUsuario(WebDriver driver, String nombre, String apellidos, String email) {
    	PO_View.checkElement(driver, "text", nombre);
    	PO_View.checkElement(driver, "text", apellidos);
    	PO_View.checkElement(driver, "text", email);
    }
    static public void checkNotUsuario(WebDriver driver, String email) {
    	SeleniumUtils.EsperaCargaPaginaNoTexto(driver, email, 3);
    }
    static public void selectUser(WebDriver driver, int index) {
    	driver.findElement(By.xpath("/html/body/div/form/div/table/tbody/tr["+index+"]/td[4]/input")).click();
    }
	public static void deleteUsers(WebDriver driver) {
		driver.findElement(By.className("btn-primary")).click();;
	}
		
}