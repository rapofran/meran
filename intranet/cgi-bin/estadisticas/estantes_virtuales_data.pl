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

use CGI::Session;
use CGI;

my $input = new CGI;
my $session = CGI::Session->load();

use Chart::OFC2;
use Chart::OFC2::Pie;
use C4::AR::Reportes;


my $params = $input->Vars;
my ($tipos_item,$colours,$cantidad) = C4::AR::Reportes::getEstantes($params);

my $chart = Chart::OFC2->new(
    'title'  => C4::AR::Filtros::i18n('Estantes Virtuales'),
    x_axis => {
        labels => {
            labels => [@$tipos_item],
        }
    },
);

my $tip = '#val# '.C4::AR::Filtros::i18n('of').' #total#<br>#percent# '.C4::AR::Filtros::i18n('of').' 100%';

my $chart_pie = Chart::OFC2::Pie->new(
    tip          => $tip,
);

$chart_pie->values([@$cantidad]);
$chart_pie->values->labels([@$tipos_item]);
$chart_pie->values->colours([@$colours]);

$chart->add_element($chart_pie);

print $session->header();
print $chart->render_chart_data({'wmode' => 'opaque'});