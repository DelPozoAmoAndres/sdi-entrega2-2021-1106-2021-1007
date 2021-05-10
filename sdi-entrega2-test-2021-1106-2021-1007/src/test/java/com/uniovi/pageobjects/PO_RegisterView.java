package com.uniovi.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_RegisterView extends PO_View {

	static void fillForm(WebDriver driver, String emailp, String namep, String lastnamep, String passwordp,
			String passwordconfp) {
		WebElement email = driver.findElement(By.name("email"));
		email.click();
		email.clear();
		email.sendKeys(emailp);
		WebElement name = driver.findElement(By.name("nombre"));
		name.click();
		name.clear();
		name.sendKeys(namep);
		WebElement lastname = driver.findElement(By.name("apellidos"));
		lastname.click();
		lastname.clear();
		lastname.sendKeys(lastnamep);
		WebElement password = driver.findElement(By.name("password"));
		password.click();
		password.clear();
		password.sendKeys(passwordp);
		WebElement passwordConfirm = driver.findElement(By.name("passwordConfirm"));
		passwordConfirm.click();
		passwordConfirm.clear();
		passwordConfirm.sendKeys(passwordconfp);
		// Pulsar el boton de Alta.
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}
	
	static public void register(WebDriver driver, String emailp, String namep, String lastnamep, String passwordp,
			String passwordconfp) {
		driver.findElement(By.name("Registrarse")).click();
		fillForm(driver, emailp, namep, lastnamep, passwordp, passwordconfp);
	}
	
	static public void error(WebDriver driver, String errorText) {
		PO_View.checkElement(driver, "text", errorText);
	}
	
	static public void expectingText(WebDriver driver, String expectingText) {
		PO_View.checkElement(driver, "text", expectingText);
	}
	
}