/*
 * Proyecto: MariaDbPortable
 * Fichero: Form2.prg
 * Descripción:
 * Autor: Fredy
 * Fecha: 01/05/2016
 */

#include "Xailer.ch"

CLASS TForm2 FROM TForm

   COMPONENT oButton1
   COMPONENT oButton2
   COMPONENT oButton3
   COMPONENT oButton4
   COMPONENT oButton5
   COMPONENT oMariaDBDataSource1
   COMPONENT oSQLTable1
   COMPONENT oDBBrowse1
   COMPONENT oButton6
   COMPONENT oDBBrowse1Column4
   COMPONENT oButton7

   METHOD CreateForm()
   METHOD FormInitialize( oSender )
   METHOD Button1Click( oSender )
   METHOD Button2Click( oSender )
   METHOD Button4Click( oSender )
   METHOD Button5Click( oSender )
   METHOD Button4Click( oSender )
   METHOD FormClose( oSender, @lClose )
   METHOD Button7Click( oSender )

ENDCLASS

#include "Form2.xfm"

//------------------------------------------------------------------------------

METHOD FormInitialize( oSender ) CLASS TForm2

  AppData:MdbPortable := TMariaDbPortable():New()
  AppData:MdbPortable:oDataSource = ::oMariaDBDataSource1

RETURN Nil

//------------------------------------------------------------------------------

METHOD Button1Click( oSender ) CLASS TForm2

   IF AppData:MdbPortable:Cargar()
      ::oMariaDBDataSource1:lConnected := .t.
      ::oSQLTable1:lOpen               := .t.
      ::cText                          := ::oMariaDBDataSource1:QueryValue("SELECT Version()")
   ELSE
      MsgStop("Imposible establecer conexión con MariaDb")
   ENDIF

RETURN Nil

//------------------------------------------------------------------------------

METHOD Button2Click( oSender ) CLASS TForm2

   IF !AppData:MdbPortable:Descargar()
      MsgStop("Imposible cancelar la conexión con MariaDb")
   ELSE
      ::oMariaDBDataSource1:lConnected := .f.
      ::oSQLTable1:lOpen               := .f.
   ENDIF

RETURN Nil

//------------------------------------------------------------------------------

METHOD Button4Click( oSender ) CLASS TForm2

   MsgInfo( "Mariadb "               + ;
            {"no se está ejecutando" , ;
             "no se está ejecutando pero estamos conectados."+CRLF+"Nos dará un error 'server has gone away' al tratar de acceder a los datos" , ;  // Alguien ha matado a Mariadb
             "se está ejecutando pero no hay conexión" ,;
             "ya se estaba ejecutano y hay conexión",;
             "hemos iniciado la ejecución y hay conexión"} [AppData:MdbPortable:nEstado()] )



RETURN Nil

//------------------------------------------------------------------------------

METHOD Button5Click( oSender ) CLASS TForm2
Local a

   AppData:MdbPortable:lDescargarOnError := oSender ==  ::oButton5
   a=1+"a" // :)

RETURN Nil

//------------------------------------------------------------------------------

METHOD FormClose( oSender, lClose ) CLASS TForm2
Local lOk := .t.

   WITH OBJECT AppData:MdbPortable

      IF :lCargadoxnosotros() //Si no lo hemos cargado nosotros no lo descargo porque puede estar usándolo otra aplicación
           IF !:Descargar()
              lOk := .t.
              MsgStop("Imposible cancelar la conexión con MariaDb")
           ENDIF
      ENDIF
   END

   IF lOk
      AppData:MdbPortable:End()
   ENDIF

RETURN Nil

//------------------------------------------------------------------------------

METHOD Button7Click( oSender ) CLASS TForm2

   AppData:MdbPortable:Matar()

RETURN Nil

//------------------------------------------------------------------------------
