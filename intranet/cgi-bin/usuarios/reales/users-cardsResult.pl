#!/usr/bin/perl
#
# Meran - MERAN UNLP is a ILS (Integrated Library System) wich provides Catalog,
# Circulation and User's Management. It's written in Perl, and uses Apache2
# Web-Server, MySQL database and Sphinx 2 indexing.
# Copyright (C) 2009-2013 Grupo de desarrollo de Meran CeSPI-UNLP
#
# This file is part of Meran.
#
# Meran is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Meran is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Meran.  If not, see <http://www.gnu.org/licenses/>.
#


use strict;
use C4::AR::Auth;

use CGI;

my $input = new CGI;

my ($template, $session, $t_params) = get_template_and_user({
                            template_name => "usuarios/reales/users-cardsResult.tmpl",
                            query => $input,
                            type => "intranet",
                            authnotrequired => 0,
                            flagsrequired => {  ui => 'ANY', 
                                                tipo_documento => 'ANY', 
                                                accion => 'CONSULTA', 
                                                entorno => 'undefined'},
                            debug => 1,
                });


my $obj=C4::AR::Utilidades::from_json_ISO($input->param('obj'));

#
$obj->{'ini'} = $obj->{'ini'} || 1;
my $ini=$obj->{'ini'};
my $inicial=$obj->{'inicial'} || 0;
my $funcion = $obj->{'funcion'};

$obj->{'orden'}=$obj->{'orden'}||'apellido';
$obj->{'apellido1'}=$obj->{'surname1'};
$obj->{'apellido2'}=$obj->{'surname2'};


my ($ini,$pageNumber,$cantR)=C4::AR::Utilidades::InitPaginador($ini);

$obj->{'cantR'} = $cantR;
$obj->{'pageNumber'} = $pageNumber;
$obj->{'ini'}=$ini;

my ($cantidad,$results)=C4::AR::Usuarios::BornameSearchForCard($obj);

$t_params->{'paginador'}= C4::AR::Utilidades::crearPaginador($cantidad,$cantR, $pageNumber,$funcion,$t_params);

#Se realiza la busqueda si al algun campo no vacio
$t_params->{'RESULTSLOOP'}=$results;
$t_params->{'cantidad'}=$cantidad;

C4::AR::Auth::output_html_with_http_headers($template, $t_params, $session);