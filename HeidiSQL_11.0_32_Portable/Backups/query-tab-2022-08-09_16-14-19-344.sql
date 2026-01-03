#select c.*,z.nomzon from ctacli as c left join ctazon as z on c.zona=z.codzon order by zona,nomcli
#SELECT ctazon.nomzon, financ.numfin, ctacli.* FROM ctacli LEFT JOIN financ ON financ.cedrif=ctacli.cif LEFT JOIN ctazon ON ctazon.codzon=ctacli.zona ORDER BY ZONA,NOMCLI
select numfin,cedrif from financ where cedrif='V162380199';
select c.*,z.nomzon from ctacli as c left join ctazon as z on c.zona=z.codzon order by nomcli;
SELECT 



DELETE FROM encalb where numalb='00012999'

