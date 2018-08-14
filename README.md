# Obliqueview Bundle
This bundle rotates oblique views.

Installation Guide
------------------
**Requirement: map.apps 4**

#### Configurable Components of dn_obliqueview:

##### 
```
"ObliqueWidgetFactory": {
    "north": "blickrichtungnord1",
    "east": "blickrichtungost1",
    "south": "blickrichtungsued1",
    "west": "blickrichtungwest1",
    "animateRotation": true
}
```

Development Guide
------------------
### Define the mapapps remote base
Before you can run the project you have to define the mapapps.remote.base property in the pom.xml-file:
`<mapapps.remote.base>http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%</mapapps.remote.base>`

##### Other methods to to define the mapapps.remote.base property.
1. Goal parameters
`mvn install -Dmapapps.remote.base=http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%`

2. Build properties
Change the mapapps.remote.base in the build.properties file and run:
`mvn install -Denv=dev -Dlocal.configfile=%ABSOLUTEPATHTOPROJECTROOT%/build.properties`
