package com.uniovi.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;


public class PO_ChatView extends PO_View {
	
	public static void sendMessageAPI(WebDriver driver, String textop) {
		WebElement texto = driver.findElement(By.id("mensaje"));
		texto.click();
		texto.clear();
		texto.sendKeys(textop);
		By boton = By.id("enviar");
		driver.findElement(boton).click();
	}
	
	public static void goToChatsAPI(WebDriver driver) {
		driver.findElement(By.name("chats")).click();
	}
	
	public static void viewChat(WebDriver driver) {
		driver.findElement(By.className("btn")).click();
	}
	
	public static void checkMessage(WebDriver driver, String textop) {
		PO_View.checkElement(driver, "text", textop);
	}
	
	public static void sendSomeMessagesAPI(WebDriver driver, String texto) {
		// Rellenamos el formulario de registro con datos correctos
		PO_LoginView.loginAPI(driver, "sergio@email.com", "00000000");
		PO_LoginView.checkHome(driver, "Tienda");
		//Hacemoss una busqueda
		PO_UserView.searchAndGoToChatAPI(driver, "Oferta3");
		PO_LoginView.checkHome(driver, "Mensaje");
		//Enviamos un mensaje a la oferta
		PO_ChatView.sendMessageAPI(driver, texto);
		//Comprobamos que se ha enviado
		PO_ChatView.checkMessage(driver, texto);
		
		//Deslogeamos
		driver.manage().deleteAllCookies();

	}
}
