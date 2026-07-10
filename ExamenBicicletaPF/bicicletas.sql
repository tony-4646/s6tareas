-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-07-2026 a las 00:40:56
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bicicletas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alquileres`
--

CREATE TABLE `alquileres` (
  `alquiler_id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `bicicleta_id` int(11) NOT NULL,
  `a_inicio` datetime DEFAULT current_timestamp(),
  `a_fin` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alquileres`
--

INSERT INTO `alquileres` (`alquiler_id`, `cliente_id`, `bicicleta_id`, `a_inicio`, `a_fin`) VALUES
(1, 1, 3, '2026-07-10 15:53:26', '2026-07-10 15:53:50'),
(2, 1, 2, '2026-07-10 16:22:34', '2026-07-10 16:24:37'),
(3, 1, 1, '2026-07-10 16:24:49', '2026-07-10 16:45:06'),
(4, 1, 3, '2026-07-10 16:24:59', '2026-07-10 16:45:09'),
(5, 1, 4, '2026-07-10 16:44:35', '2026-07-10 16:48:05'),
(6, 1, 5, '2026-07-10 16:44:40', '2026-07-10 16:51:46'),
(7, 1, 1, '2026-07-10 16:45:19', '2026-07-10 16:51:41'),
(8, 1, 3, '2026-07-10 16:45:57', '2026-07-10 16:51:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bicicletas`
--

CREATE TABLE `bicicletas` (
  `bicicleta_id` int(11) NOT NULL,
  `b_codigo` varchar(10) NOT NULL,
  `b_tipo` enum('un_asiento','dos_asientos','off_road','electrica') NOT NULL,
  `b_estado` enum('en_estacion','prestada','en_mantenimiento') DEFAULT 'en_estacion',
  `estacion_id` int(11) DEFAULT NULL,
  `b_disponible` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `bicicletas`
--

INSERT INTO `bicicletas` (`bicicleta_id`, `b_codigo`, `b_tipo`, `b_estado`, `estacion_id`, `b_disponible`) VALUES
(1, 'BMX1', 'electrica', 'en_estacion', 3, 1),
(2, 'AX1', 'off_road', 'en_estacion', 3, 0),
(3, 'AW-202', 'off_road', 'en_estacion', 3, 1),
(4, 'DOI-213', 'dos_asientos', 'en_estacion', 3, 1),
(5, 'KL-212', 'dos_asientos', 'en_estacion', 3, 1),
(7, 'KQ-1', 'dos_asientos', 'en_estacion', NULL, 0),
(8, 'UX-2', 'un_asiento', 'en_estacion', 3, 1),
(9, 'EL-21321', 'dos_asientos', 'en_estacion', 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `cliente_id` int(11) NOT NULL,
  `c_nombres` varchar(150) NOT NULL,
  `c_documento` varchar(150) NOT NULL,
  `c_telefono` varchar(15) DEFAULT NULL,
  `c_email` varchar(125) DEFAULT NULL,
  `c_disponible` tinyint(1) DEFAULT 1
) ;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`cliente_id`, `c_nombres`, `c_documento`, `c_telefono`, `c_email`, `c_disponible`) VALUES
(1, 'Juan Mosquera', '09213912321', '0987654321', 'segundo@gmail.com', 0),
(2, 'Segundo Augusto', '09123901239', '08139218939123', 'segundw@gmail.com', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estaciones`
--

CREATE TABLE `estaciones` (
  `estacion_id` int(11) NOT NULL,
  `e_nombre` varchar(100) NOT NULL,
  `e_direccion` varchar(100) NOT NULL,
  `e_capacidad` int(11) NOT NULL,
  `e_ciudad` varchar(100) NOT NULL,
  `e_disponible` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estaciones`
--

INSERT INTO `estaciones` (`estacion_id`, `e_nombre`, `e_direccion`, `e_capacidad`, `e_ciudad`, `e_disponible`) VALUES
(2, 'Estación 1', 'Juarez y mendoza', 5, 'Ambato', 0),
(3, 'Estacion 2', 'Nuñez y olmedo', 6, 'Patate', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alquileres`
--
ALTER TABLE `alquileres`
  ADD PRIMARY KEY (`alquiler_id`),
  ADD KEY `cliente_id` (`cliente_id`),
  ADD KEY `bicicleta_id` (`bicicleta_id`);

--
-- Indices de la tabla `bicicletas`
--
ALTER TABLE `bicicletas`
  ADD PRIMARY KEY (`bicicleta_id`),
  ADD UNIQUE KEY `b_codigo` (`b_codigo`),
  ADD KEY `estacion_id` (`estacion_id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`cliente_id`),
  ADD UNIQUE KEY `c_documento` (`c_documento`);

--
-- Indices de la tabla `estaciones`
--
ALTER TABLE `estaciones`
  ADD PRIMARY KEY (`estacion_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alquileres`
--
ALTER TABLE `alquileres`
  MODIFY `alquiler_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `bicicletas`
--
ALTER TABLE `bicicletas`
  MODIFY `bicicleta_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `cliente_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estaciones`
--
ALTER TABLE `estaciones`
  MODIFY `estacion_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alquileres`
--
ALTER TABLE `alquileres`
  ADD CONSTRAINT `alquileres_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`),
  ADD CONSTRAINT `alquileres_ibfk_2` FOREIGN KEY (`bicicleta_id`) REFERENCES `bicicletas` (`bicicleta_id`);

--
-- Filtros para la tabla `bicicletas`
--
ALTER TABLE `bicicletas`
  ADD CONSTRAINT `bicicletas_ibfk_1` FOREIGN KEY (`estacion_id`) REFERENCES `estaciones` (`estacion_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
