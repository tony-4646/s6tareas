-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-07-2026 a las 01:56:59
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
-- Base de datos: `restaurante`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `cliente_id` int(11) NOT NULL,
  `c_nombre` varchar(100) NOT NULL,
  `c_apellido` varchar(100) NOT NULL,
  `c_email` varchar(125) DEFAULT NULL CHECK (`c_email` regexp '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$'),
  `c_telefono` varchar(15) DEFAULT NULL CHECK (char_length(`c_telefono`) >= 10),
  `c_disponible` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`cliente_id`, `c_nombre`, `c_apellido`, `c_email`, `c_telefono`, `c_disponible`) VALUES
(1, 'Juan', 'Marco', 'okok@gmail.com', '09901329213', 1),
(2, 'Paulo', 'Marco', 'Paulo@gmail.com', '0987654322', 1),
(3, 'Lourdes', 'Mondragón', 'ok@gmail.com', '092382183712', 1),
(4, 'Luan', 'García', 'luan@gmail.com', '09139812391', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_ordenes`
--

CREATE TABLE `detalles_ordenes` (
  `detalle_id` int(11) NOT NULL,
  `orden_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `d_cantidad` int(11) NOT NULL CHECK (`d_cantidad` > 0),
  `d_precio_unitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalles_ordenes`
--

INSERT INTO `detalles_ordenes` (`detalle_id`, `orden_id`, `menu_id`, `d_cantidad`, `d_precio_unitario`) VALUES
(1, 1, 1, 1, 1.25),
(2, 1, 2, 2, 1.00),
(3, 2, 2, 2, 1.10),
(4, 3, 3, 1, 0.50),
(5, 3, 2, 1, 1.10),
(6, 4, 3, 1, 0.50),
(7, 4, 2, 3, 1.10),
(8, 4, 1, 1, 1.25),
(9, 5, 3, 2, 0.50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menus`
--

CREATE TABLE `menus` (
  `menu_id` int(11) NOT NULL,
  `m_nombre` varchar(50) NOT NULL,
  `m_descripcion` varchar(150) NOT NULL,
  `m_precio` decimal(10,2) NOT NULL,
  `m_disponible` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `menus`
--

INSERT INTO `menus` (`menu_id`, `m_nombre`, `m_descripcion`, `m_precio`, `m_disponible`) VALUES
(1, 'Hamburguesa pequeña', 'Carne pequeña, queso, lechuga y pepinillo', 1.25, 1),
(2, 'Hot dog simple', 'salchichas y pan tostado, con papas fritas y adherezos', 1.10, 1),
(3, 'Empanada de queso', 'De queso de sopa', 0.50, 1),
(5, 'wawaw', 'ok ok', 0.10, 0),
(6, 'okdowkadd', 'wadwadwa', 0.20, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes`
--

CREATE TABLE `ordenes` (
  `orden_id` int(11) NOT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `o_fecha_orden` timestamp NOT NULL DEFAULT current_timestamp(),
  `o_estado` enum('pendiente','en_cocina','listo','entregado','cancelado') DEFAULT 'pendiente',
  `o_total` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ordenes`
--

INSERT INTO `ordenes` (`orden_id`, `cliente_id`, `o_fecha_orden`, `o_estado`, `o_total`) VALUES
(1, 1, '2026-07-03 19:09:36', 'entregado', 3.25),
(2, 3, '2026-07-03 22:22:33', 'entregado', 2.20),
(3, 3, '2026-07-03 23:05:55', 'pendiente', 1.60),
(4, 3, '2026-07-03 23:11:53', 'entregado', 5.05),
(5, 3, '2026-07-03 23:23:03', 'entregado', 1.00);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`cliente_id`);

--
-- Indices de la tabla `detalles_ordenes`
--
ALTER TABLE `detalles_ordenes`
  ADD PRIMARY KEY (`detalle_id`),
  ADD KEY `orden_id` (`orden_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indices de la tabla `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`menu_id`);

--
-- Indices de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD PRIMARY KEY (`orden_id`),
  ADD KEY `cliente_id` (`cliente_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `cliente_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `detalles_ordenes`
--
ALTER TABLE `detalles_ordenes`
  MODIFY `detalle_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `menus`
--
ALTER TABLE `menus`
  MODIFY `menu_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  MODIFY `orden_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalles_ordenes`
--
ALTER TABLE `detalles_ordenes`
  ADD CONSTRAINT `detalles_ordenes_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes` (`orden_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalles_ordenes_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`menu_id`);

--
-- Filtros para la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD CONSTRAINT `ordenes_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
