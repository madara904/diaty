# Todo

## Kernfunktionen
* Tracking der daily intakes Nährwerte (Kalorien, Kohlenhydrate, Fett etc. )
* vorgegebener Diätplan 
* Eingabe der Kalorien manuell (oder durch Suche in einer Food-database)
* Kalkulation der Daily Intakes 
* Daily Intake Anzeige (Progressbar / Progress Kreis mit state zb. wenn zu viel dann rot)

# nice to have
* Ai Generated recipes for intakes

## route layout

```
- dashboard 
- overview per day (/ week)
- add (add food + search bar, add calroies)
    - Text input
    - submit button
```

# data

* user table ✅
* tracking table
    * id
    * timestamp (mm,dd,yyyy hh:mm:ss)
    * nutrition (carbs, protein, calories...)
    * name (optional?)
    * userid 
* plan-templates
    * id
    * nutritions
    * name 
* user-plans
    * id
    * user
    * nutritions
    * name 
    * timestamp (mm,dd,yyyy hh:mm:ss)



