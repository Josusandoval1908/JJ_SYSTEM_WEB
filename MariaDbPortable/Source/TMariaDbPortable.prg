/*
 * Proyecto: MariaDbPortable
 * Fichero: TMariaDbPortable.prg
 * Descripción:
 * Autor: Fredy
 * Fecha: 01/05/2016
 */

#include "Xailer.ch"

CLASS TMariaDbPortable FROM TComponent

    DATA  oWMI           // Datas usadas cara conectar con el WMI
    DATA  oSrv
    DATA  oItm
    DATA  cPid
    DATA  hWnd

    DATA nCargado          INIT -1            // -1: No se ha cargado Mariadb, 0: Ya estaba cargado, 1: Lo hemos cargado nosotros
    DATA lEjecutando       INIT .F.           // Ya se está ejecutando Mariadb
    DATA cRutaExe                             // Si ya está cargado, ruta completa del exe
    DATA nLimite           INIT 20            // Segundos para intentar cerrar Mariadb

    DATA lDescargarOnError INIT .T.           // Intenta descargar Mariadb cuando se produce un error

    DATA cRuta             INIT ".\MDB"       // Directorio de Mariadb
    DATA cfichero          INIT "mysqldpt"    // Normbre de la instancia de Mariadb a ejecutar
    DATA nPort             INIT 3308          // Puerto

DATA oDataSource
    METHOD New             CONSTRUCTOR
    METHOD Cargar                             // Ejecutamos Mariadb si no se está ejecutando ya
    METHOD Descargar                          // Intenta cerrar el proceso correctamente
    METHOD lCargadoxnosotros                  // .T. Si hemos cargado nosotros la instancia Mariadb
    METHOD Consultar                          // Mira si nuestro Mariadb ya está en memoria
    METHOD Matar                              // Intenta cerrar Mariadb matando el proceso
    METHOD nEstado
    METHOD END


END CLASS

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

METHOD New
 RETURN Self

//------------------------------------------------------------------------------

METHOD lCargadoxnosotros
 RETURN IsRunning( ::hWnd )

//------------------------------------------------------------------------------

METHOD Cargar()
Local nSeconds := Seconds()
Local lOk      := .t.

   Application:SetBusy( .t. )

   ::Consultar()
   IF !::lEjecutando
      ::hWnd  :=  Execute( ::cRuta + "\bin\" + ::cfichero + " --standalone --debug  --port="+ Alltrim( Str(::nPort) ) , , .f., SW_HIDE )
   ENDIF
   DO WHILE !::Consultar() .AND. lOk
      IF Seconds() - nSeconds > ::nLimite
         lOk := .f.
      ENDIF
      Sleep(100)
   END

   ::nCargado := IF( ::lEjecutando, 0, IF( ::lCargadoxnosotros(), 1, -1 ) )

   Application:SetBusy(.f.)

RETURN ::nCargado >= 0

//------------------------------------------------------------------------------

METHOD Descargar()
Local nSeconds := Seconds()
Local lOk      := .t.

   Application:SetBusy(.t.)

   Execute( ::cRuta+"\bin\" + "mysqladmin -u root -P " + AllTrim( Str( ::nPort ) ) + " shutdown", .t. )
   DO WHILE ::lCargadoxnosotros() .AND. lOk
      IF Seconds() - nSeconds > ::nLimite
         lOk := .f.
      ENDIF
      ProcessMessages()
   ENDDO

   ::Consultar()
   IF !::lCargadoxnosotros() .OR. !::lEjecutando
      ::nCargado := -1
   ELSE

   ENDIF

   Application:SetBusy(.f.)

RETURN ::nCargado == -1

//------------------------------------------------------------------------------

METHOD Consultar
Local   oObj, nResultado

   //CursorWait() //  no funciona
   Application:SetBusy(.t.)

   ::cPid        := MemoRead( ::cRuta + "\data\"+GetComputerName()+".pid" )
   ::lEjecutando := .f.

   IF !Empty( ::cPid )
      ::oWMI        := TOleAuto():New( "WbemScripting.SWbemLocator" )
      ::oSrv        := ::oWMI:ConnectServer( ".", "root\CIMV2" )
      ::oItm        := ::oSrv:ExecQuery( 'SELECT * FROM Win32_Process WHERE Processid = ' +  ::cPid  )
      ::lEjecutando :=  ::oItm:Count == 1
   ENDIF

   IF ::lEjecutando
      FOR EACH oObj IN ::oItm
         ::cRutaExe := oObj:ExecutablePath
      NEXT
   ENDIF

   ::nCargado := IF( ::lEjecutando, 0, IF( ::lCargadoxnosotros(), 1, -1 ) )

   Application:SetBusy(.f.)

RETURN ::lEjecutando

//------------------------------------------------------------------------------

METHOD Matar
Local oObj, nRetorno

   IF ::Consultar()
      FOR EACH oObj IN ::oItm
          nRetorno := oObj:Terminate()
       NEXT
   ENDIF

RETURN !::Consultar() .and. nRetorno == 0

//------------------------------------------------------------------------------

METHOD nEstado
Local nEstado

   ::Consultar()
   IF ::nCargado = -1
      IF !::lEjecutando
         nEstado := 1 // No se está ejecutando
         IF ValType(::oDataSource) ="O" .AND. ::oDataSource:lConnected
            nEstado = 2 // No se esta ejecutando pero estamos conectados
         ENDIF
      ELSE
         nEstado := 3 // Se está ejecutando pero no se ha establecido conexión
      ENDIF
   ELSE
      IF !::lCargadoxnosotros()
         nEstado := 4 // Ya esta estaba cargada y se está ejecutando
      ELSE
         nEstado := 5 // Se ha cargado y se está ejecutando
      ENDIF
   ENDIF

RETURN nEstado

//------------------------------------------------------------------------------

METHOD END

   ::oWMI := Nil
   ::oSrv := Nil

RETURN ::Super:End()

//------------------------------------------------------------------------------

FUNCTION ShowError( cMessage, aOptions )  // --> nResult
LOCAL nRet

   IF AppData:MdbPortable:lDescargarOnError   // Qué pasa con secuences?
      AppData:MdbPortable:Descargar()         // Qué pasa con los GPF? XA_GpfHandler
   ENDIF                                      // Qué pasa si el objeto no es AppData:MdbPortable ?

   WITH OBJECT TErrorForm()
      :cMessage := cMessage
      :aOptions := aOptions
      :New( Application:oMainForm )
      nRet := :ShowModal( , .T. )
   END

   IF nRet == Nil
      nRet := 1
   ENDIF

RETURN nRet

