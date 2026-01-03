/*
 * Proyecto: MariaDbPortable
 * Fichero: MariaDbPortable.prg
 * Descripción: Módulo de entrada a la aplicación
 * Autor:  Fredy
 * Fecha: 01/05/2016
 */

#include "Xailer.ch"

Procedure Main()

   AppData:AddData("MdbPortable")
   Application:cTitle := "MariaDbPortable"
   TForm2():New( Application ):Show()
   Application:Run()

Return
