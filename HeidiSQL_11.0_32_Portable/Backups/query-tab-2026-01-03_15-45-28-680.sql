-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.1.13-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win32
-- HeidiSQL Versión:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Volcando estructura para tabla jjsystem.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `USER` varchar(30) COLLATE utf8_spanish2_ci NOT NULL,
  `CLAVE` varchar(10) COLLATE utf8_spanish2_ci NOT NULL,
  `MAPA` varchar(15) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `INICIO` varchar(10) COLLATE utf8_spanish2_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- Volcando datos para la tabla jjsystem.usuarios: ~3 rows (aproximadamente)
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` (`USER`, `CLAVE`, `MAPA`, `INICIO`) VALUES
	('JOSUE', '19894', '', ''),
	('RAFAEL', '24037', NULL, NULL),
	('PRUEBA', '12345', '', '');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
