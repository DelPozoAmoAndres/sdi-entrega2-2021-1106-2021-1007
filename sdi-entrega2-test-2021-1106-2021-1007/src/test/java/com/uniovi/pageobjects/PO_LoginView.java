package com.uniovi.pageobjects;


import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.utils.SeleniumUtils;

public class PO_LoginView extends PO_View {

	static void fillForm(WebDriver driver, String emailp, String passwordp) {
		WebElement email = driver.findElement(By.name("email"));
		email.click();
		email.clear();
		email.sendKeys(emailp);
		
		WebElement password = driver.findElement(By.name("password"));
		password.click();
		password.clear();
		password.sendKeys(passwordp);
		// Pulsar el boton de Alta.
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}
	
	static public void checkHome(WebDriver driver,String name) {
		PO_View.checkElement(driver, "text", name);
	}
	static public void login(WebDriver driver, String emailp, String passwordp) {
		driver.findElement(By.name("Login")).click();
		fillForm(driver, emailp, passwordp);
	}
	static public void error(WebDriver driver, String errorText) {
		PO_View.checkElement(driver, "text", errorText);
	}
	static public void logout(WebDriver driver) {
		By logout = By.name("Logout");
		driver.findElement(logout).click();
	}
	static public void checkNotLoged(WebDriver driver) {
		PO_View.checkElement(driver, "text", "Identifícate");
		PO_View.checkElement(driver, "text", "Registrate");
	}
	static public void checkNoLogoutBut(WebDriver driver) {
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Desconectarse", 2);
	}

	public static void loginAPI(WebDriver driver, String emailp, String passwordp) {
		driver.navigate().to("https://localhost:3000/cliente.html?w=login");
		fillForm(driver, emailp, passwordp);
	}
}