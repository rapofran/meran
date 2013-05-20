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
require Exporter;
use CGI;
use C4::AR::Auth;       # get_template_and_user

my $input = new CGI;

##Aca se controlo el cambio de idioma
my $session =   CGI::Session->load();
my $locale  =   $input->param('lang_server');

$session->param('usr_locale', $locale );


C4::AR::Auth::_init_i18n({ type => 'opac' });

my $referer = $ENV{'HTTP_REFERER'};
my %params = {};

my $nro_socio_logged = C4::AR::Auth::getSessionNroSocio();
my $socio = C4::AR::Usuarios::getSocioInfoPorNroSocio($nro_socio_logged) || C4::Modelo::UsrSocio->new();

if ($nro_socio_logged){
    $socio->setLocale($locale);
    C4::AR::Debug::debug("USR_LOCALE DE SOCIO => ".$socio->getLocale);
}


#regreso a la pagina en la que estaba
C4::AR::Auth::redirectTo($referer);