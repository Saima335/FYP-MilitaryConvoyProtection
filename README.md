# MilitaryConvoyProtection
A mobile application built to provide protection to convoys by generating timely alerts using django and React Native
|  |   | |
| --- | --- | --- |
| ![image](https://user-images.githubusercontent.com/85702927/211270026-abd42334-7d0f-4610-9f11-0e386ea88f32.png)  |  ![image](https://user-images.githubusercontent.com/85702927/211270058-554bf90c-a5a4-4e7a-84f9-cb0e3d04486a.png) | ![image](https://user-images.githubusercontent.com/85702927/211272852-a4a1c74a-16ac-4359-8d30-e4dc778d8bdc.png) |
# Objective
* Develop a system that will generate alert.
* Make terrorist ready before the attack of terrorists thus reducing the risk.
* AR technology gives the soldier sight of the position of terrorists.
* Detect the landmines that might be expected on their way.
# System Overview
![image](https://user-images.githubusercontent.com/85702927/211266195-53f658e8-885a-4227-b774-b2a750c4498d.png)
# Features
* Human Detection
* Locate Terrorist (Using AR)
* Hotspot Prediction
* Risk Analysis
* Triggering Alerts
* Landmine Detection
# App Development
The frontend of mobile application is developed using react native that will help users in using the application. After that a REST API backend is created using django which will handle the requests coming from the frontend.
# Development Requirements
React-Native

Django

MongoDB
# Installation

# Quick Start
Dataset is available at https://drive.google.com/file/d/1OUcAfFg4po9-Z0hHEVSKW768JbNqoWV3/view?usp=sharing and drone videos are available at https://drive.google.com/file/d/1n-VxFqy-xJTbtCfhG-9Cuxc4oAstcMI4/view?usp=sharing

Extract and place the files inside djangobackend

First clone the repository
```
git clone https://github.com/Saima335/FYP-MilitaryConvoyProtection
```
After cloning go inside the googleMapReactTest folder and run the frontend:
```
npm install
npm run android
```
Then go inside djangobackend and run the server:
```
pip install -r requirements.txt 
python manage.py runserver
```
