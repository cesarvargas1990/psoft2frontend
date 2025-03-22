/*
SQLyog Ultimate v8.71 
MySQL - 5.7.28-0ubuntu0.19.04.2 
*********************************************************************
*/
/*!40101 SET NAMES utf8 */;

insert into `psmenu` (`id`, `nombre`, `ruta`, `icono`, `orden`, `id_mpadre`, `id_perfil`, `ind_activo`, `id_empresa`, `created_at`, `updated_at`) values('1','Principal','dashboard','dashboard','1',NULL,'1','1','1',NULL,NULL);
insert into `psmenu` (`id`, `nombre`, `ruta`, `icono`, `orden`, `id_mpadre`, `id_perfil`, `ind_activo`, `id_empresa`, `created_at`, `updated_at`) values('2','Salir','logout','logout','10',NULL,'1','1','1',NULL,NULL);
insert into `psmenu` (`id`, `nombre`, `ruta`, `icono`, `orden`, `id_mpadre`, `id_perfil`, `ind_activo`, `id_empresa`, `created_at`, `updated_at`) values('3','Clientes','clientes','person','2',NULL,'1','1','1',NULL,NULL);
insert into `psmenu` (`id`, `nombre`, `ruta`, `icono`, `orden`, `id_mpadre`, `id_perfil`, `ind_activo`, `id_empresa`, `created_at`, `updated_at`) values('4','Crear','clientes/crear','add','1','3','1','1','1',NULL,NULL);
insert into `psmenu` (`id`, `nombre`, `ruta`, `icono`, `orden`, `id_mpadre`, `id_perfil`, `ind_activo`, `id_empresa`, `created_at`, `updated_at`) values('5','Listar','clientes/listar','list','2','3','1','1','1',NULL,NULL);
insert into `psmenu` (`id`, `nombre`, `ruta`, `icono`, `orden`, `id_mpadre`, `id_perfil`, `ind_activo`, `id_empresa`, `created_at`, `updated_at`) values('6','Crear Prestamo','clientes/crearPrestamo','add','2','3','1','1','1',NULL,NULL);
insert into `psmenu` (`id`, `nombre`, `ruta`, `icono`, `orden`, `id_mpadre`, `id_perfil`, `ind_activo`, `id_empresa`, `created_at`, `updated_at`) values('7','Parametros','parametros','settings','3',NULL,'1','1','1',NULL,NULL);
insert into `psmenu` (`id`, `nombre`, `ruta`, `icono`, `orden`, `id_mpadre`, `id_perfil`, `ind_activo`, `id_empresa`, `created_at`, `updated_at`) values('8','Formas de pago','parametros/formaspago','playlist_add','1','7','1','1','1',NULL,NULL);
insert into `psmenu` (`id`, `nombre`, `ruta`, `icono`, `orden`, `id_mpadre`, `id_perfil`, `ind_activo`, `id_empresa`, `created_at`, `updated_at`) values('9','Documentos','parametros/documentos','file_copy','2','7','1','1','1',NULL,NULL);
