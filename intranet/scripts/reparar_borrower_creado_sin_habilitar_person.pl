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
# Personas NO habilitadas que tienen un borrower creado

use strict;
require Exporter;
use C4::Context;
use C4::AR::Persons_Members;

 my $dbh = C4::Context->dbh;
 my @results;
 my $cant=0;
open (L,">/tmp/habilitar_persons");


my $personas = " SELECT *  FROM persons where (persons.categorycode ='ES' or persons.categorycode ='EG'  or persons.categorycode ='PG') and borrowernumber is null "; #Alumnos no habilitados!!
 my $sth3=$dbh->prepare($personas);
  $sth3->execute();
  
  while (my $per=$sth3->fetchrow_hashref){
  
  my $borrower = " SELECT *  FROM borrowers  WHERE cardnumber = ? ";
  my $sth4=$dbh->prepare($borrower);
  $sth4->execute($per->{'cardnumber'});

  if (my $bor= $sth4->fetchrow_hashref){#Si existe es una persona no esta habilitada pero tiene un borrower creado con su mismo cardnumber
   $cant ++;
   #Actualizo el borrower con los datos de la persona.
   $per->{'borrowernumber'}=$bor->{'borrowernumber'};
   updateborrower($per);
   #Actualizo la persona con el borrowernumber.
   updateperson($per);

   printf L $per->{'surname'}.", ".$per->{'firstname'}." -- (".$per->{'categorycode'}.")  -- ".$per->{'cardnumber'}."  \n";
  }

$sth4->finish();
  }

close L;
$sth3->finish();
print "Cantidad:  ".$cant." \n";

#
#

#addmembers(@results);

#
#


print " Reparados \n";