#select t.codmovban,t.numdoc,t.tipban,t.fecha_mov,t.concepto,t.renalbrenalbimporte,t.tasadolar,t.dimporte,t.origen,t.hora from traban as t where t.codmovban='00002' and fecha_mov>='20220320'and fecha_mov<='20220330'
#SELECT * FROM CTACLI WHERE CODCLI='19191'
#SELECT encalb.*, ctavdd.NOMVEN FROM encalb LEFT JOIN CTAVDD ON encalb.CODVEN=ctavdd.CODVEN where encalb.codven = '09' and encalb.emision>='2022-05-01' and encalb.emision<='2022-05-10'
SELECT codcli, nomcli from ctacli where codcli>='00001'and codcli<='99999';
SELECT * from ctacli where codcli>='00001'and codcli<='99999' and grupo='02' ORDER BY codcli;
