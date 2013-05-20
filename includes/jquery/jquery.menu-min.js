/*
 * Meran - MERAN UNLP is a ILS (Integrated Library System) wich provides Catalog,
 * Circulation and User's Management. It's written in Perl, and uses Apache2
 * Web-Server, MySQL database and Sphinx 2 indexing.
 * Copyright (C) 2009-2013 Grupo de desarrollo de Meran CeSPI-UNLP
 *
 * This file is part of Meran.
 *
 * Meran is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Meran is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Meran.  If not, see <http://www.gnu.org/licenses/>.
 */

(function($){var g=[],visibleMenus=[],activeMenu=activeItem=null,menuDIVElement=$('<div class="menu-div outerbox" style="position:absolute;top:0;left:0;display:none;"><div class="shadowbox1"></div><div class="shadowbox2"></div><div class="shadowbox3"></div></div>')[0],menuULElement=$('<ul class="menu-ul innerbox"></ul>')[0],menuItemElement=$('<li style="position:relative;"><div class="menu-item"></div></li>')[0],arrowElement=$('<img class="menu-item-arrow" />')[0],$rootDiv=$('<div id="root-menu-div" style="position:absolute;top:0;left:0;"></div>'),defaults={showDelay:200,hideDelay:200,hoverOpenDelay:0,offsetTop:0,offsetLeft:0,minWidth:0,onOpen:null,onClose:null,onClick:null,arrowSrc:null,addExpando:false,copyClassAttr:false};$(function(){$rootDiv.appendTo('body')});$.extend({MenuCollection:function(a){this.menus=[];this.init(a)}});$.extend($.MenuCollection,{prototype:{init:function(a){if(a&&a.length){for(var i=0;i<a.length;i++){this.addMenu(a[i]);a[i].menuCollection=this}}},addMenu:function(a){if(a instanceof $.Menu)this.menus.push(a);a.menuCollection=this;var b=this;$(a.target).hover(function(){if(a.visible)return;for(var i=0;i<b.menus.length;i++){if(b.menus[i].visible){b.menus[i].hide();a.show();return}}},function(){})}}});$.extend({Menu:function(a,b,c){this.menuItems=[];this.subMenus=[];this.visible=false;this.active=false;this.parentMenuItem=null;this.settings=$.extend({},defaults,c);this.target=a;this.$eDIV=null;this.$eUL=null;this.timer=null;this.menuCollection=null;this.openTimer=null;this.init();if(b&&b.constructor==Array)this.addItems(b)}});$.extend($.Menu,{checkMouse:function(e){var t=e.target;if(visibleMenus.length&&t==visibleMenus[0].target)return;while(t.parentNode&&t.parentNode!=$rootDiv[0])t=t.parentNode;if(!$(visibleMenus).filter(function(){return this.$eDIV[0]==t}).length){$.Menu.closeAll()}},checkKey:function(e){switch(e.keyCode){case 13:if(activeItem)activeItem.click(e,activeItem.$eLI[0]);break;case 27:$.Menu.closeAll();break;case 37:if(!activeMenu)activeMenu=visibleMenus[0];var a=activeMenu;if(a&&a.parentMenuItem){var b=a.parentMenuItem;b.$eLI.unbind('mouseout').unbind('mouseover');a.hide();b.hoverIn(true);setTimeout(function(){b.bindHover()})}else if(a&&a.menuCollection){var c,mcm=a.menuCollection.menus;if((c=$.inArray(a,mcm))>-1){if(--c<0)c=mcm.length-1;$.Menu.closeAll();mcm[c].show();mcm[c].setActive();if(mcm[c].menuItems.length)mcm[c].menuItems[0].hoverIn(true)}}break;case 38:if(activeMenu)activeMenu.selectNextItem(-1);break;case 39:if(!activeMenu)activeMenu=visibleMenus[0];var m,a=activeMenu,asm=activeItem?activeItem.subMenu:null;if(a){if(asm&&asm.menuItems.length){asm.show();asm.menuItems[0].hoverIn()}else if((a=a.inMenuCollection())){var c,mcm=a.menuCollection.menus;if((c=$.inArray(a,mcm))>-1){if(++c>=mcm.length)c=0;$.Menu.closeAll();mcm[c].show();mcm[c].setActive();if(mcm[c].menuItems.length)mcm[c].menuItems[0].hoverIn(true)}}}break;case 40:if(!activeMenu){if(visibleMenus.length&&visibleMenus[0].menuItems.length)visibleMenus[0].menuItems[0].hoverIn()}else activeMenu.selectNextItem();break}if(e.keyCode>36&&e.keyCode<41)return false},closeAll:function(){while(visibleMenus.length)visibleMenus[0].hide()},setDefaults:function(d){$.extend(defaults,d)},prototype:{init:function(){var a=this;if(!this.target)return;else if(this.target instanceof $.MenuItem){this.parentMenuItem=this.target;this.target.addSubMenu(this);this.target=this.target.$eLI}g.push(this);this.$eDIV=$(menuDIVElement.cloneNode(1));this.$eUL=$(menuULElement.cloneNode(1));this.$eDIV[0].appendChild(this.$eUL[0]);$rootDiv[0].appendChild(this.$eDIV[0]);if(!this.parentMenuItem){$(this.target).click(function(e){a.onClick(e)}).hover(function(e){a.setActive();if(a.settings.hoverOpenDelay){a.openTimer=setTimeout(function(){if(!a.visible)a.onClick(e)},a.settings.hoverOpenDelay)}},function(){if(!a.visible)$(this).removeClass('activetarget');if(a.openTimer)clearTimeout(a.openTimer)})}else{this.$eDIV.hover(function(){a.setActive()},function(){})}},setActive:function(){if(!this.parentMenuItem)$(this.target).addClass('activetarget');else this.active=true},addItem:function(a){if(a instanceof $.MenuItem){if($.inArray(a,this.menuItems)==-1){this.$eUL.append(a.$eLI);this.menuItems.push(a);a.parentMenu=this;if(a.subMenu)this.subMenus.push(a.subMenu)}}else{this.addItem(new $.MenuItem(a,this.settings))}},addItems:function(a){for(var i=0;i<a.length;i++){this.addItem(a[i])}},removeItem:function(a){var b=$.inArray(a,this.menuItems);if(b>-1)this.menuItems.splice(b,1);a.parentMenu=null},hide:function(){if(!this.visible)return;var i,pos=$.inArray(this,visibleMenus);this.$eDIV.hide();if(pos>=0)visibleMenus.splice(pos,1);this.visible=this.active=false;$(this.target).removeClass('activetarget');for(i=0;i<this.subMenus.length;i++){this.subMenus[i].hide()}for(i=0;i<this.menuItems.length;i++){if(this.menuItems[i].active)this.menuItems[i].setInactive()}if(!visibleMenus.length)$(document).unbind('mousedown',$.Menu.checkMouse).unbind('keydown',$.Menu.checkKey);if(activeMenu==this)activeMenu=null;if(this.settings.onClose)this.settings.onClose.call(this)},show:function(e){if(this.visible)return;var a,pmi=this.parentMenuItem;if(this.menuItems.length){if(pmi){a=parseInt(pmi.parentMenu.$eDIV.css('z-index'));this.$eDIV.css('z-index',(isNaN(a)?1:a+1))}this.$eDIV.css({visibility:'hidden',display:'block'});if(this.settings.minWidth){if(this.$eDIV.width()<this.settings.minWidth)this.$eDIV.css('width',this.settings.minWidth)}this.setPosition();this.$eDIV.css({display:'none',visibility:''}).show();if($.browser.msie)this.$eUL.css('width',parseInt($.browser.version)==6?this.$eDIV.width()-7:this.$eUL.width());if(this.settings.onOpen)this.settings.onOpen.call(this)}if(visibleMenus.length==0)$(document).bind('mousedown',$.Menu.checkMouse).bind('keydown',$.Menu.checkKey);this.visible=true;visibleMenus.push(this)},setPosition:function(){var a,o,posX,posY,pmo,wst,wsl,ww=$(window).width(),wh=$(window).height(),pmi=this.parentMenuItem,height=this.$eDIV[0].clientHeight,width=this.$eDIV[0].clientWidth,pheight;if(pmi){o=pmi.$eLI.offset();posX=o.left+pmi.$eLI.width();posY=o.top}else{a=$(this.target);o=a.offset();posX=o.left+this.settings.offsetLeft;posY=o.top+a.height()+this.settings.offsetTop}if($.fn.scrollTop){wst=$(window).scrollTop();if(wh<height){posY=wst}else if(wh+wst<posY+height){if(pmi){pmo=pmi.parentMenu.$eDIV.offset();pheight=pmi.parentMenu.$eDIV[0].clientHeight;if(height<=pheight){posY=pmo.top+pheight-height}else{posY=pmo.top}if(wh+wst<posY+height){posY-=posY+height-(wh+wst)}}else{posY-=posY+height-(wh+wst)}}}if($.fn.scrollLeft){wsl=$(window).scrollLeft();if(ww+wsl<posX+width){if(pmi){posX-=pmi.$eLI.width()+width;if(posX<wsl)posX=wsl}else{posX-=posX+width-(ww+wsl)}}}this.$eDIV.css({left:posX,top:posY})},onClick:function(e){if(this.visible){this.hide();this.setActive()}else{$.Menu.closeAll();this.show(e)}},addTimer:function(a,b){var c=this;this.timer=setTimeout(function(){a.call(c);c.timer=null},b)},removeTimer:function(){if(this.timer){clearTimeout(this.timer);this.timer=null}},selectNextItem:function(a){var i,pos=0,mil=this.menuItems.length,o=a||1;for(i=0;i<mil;i++){if(this.menuItems[i].active){pos=i;break}}this.menuItems[pos].hoverOut();do{pos+=o;if(pos>=mil)pos=0;else if(pos<0)pos=mil-1}while(this.menuItems[pos].separator);this.menuItems[pos].hoverIn(true)},inMenuCollection:function(){var m=this;while(m.parentMenuItem)m=m.parentMenuItem.parentMenu;return m.menuCollection?m:null},destroy:function(){var a,item;this.hide();if(!this.parentMenuItem)$(this.target).unbind('click').unbind('mouseover').unbind('mouseout');else this.$eDIV.unbind('mouseover').unbind('mouseout');while(this.menuItems.length){item=this.menuItems[0];item.destroy();delete item}if((a=$.inArray(this,g))>-1)g.splice(a,1);if(this.menuCollection){if((a=$.inArray(this,this.menuCollection.menus))>-1)this.menuCollection.menus.splice(a,1)}this.$eDIV.remove()}}});$.extend({MenuItem:function(a,b){if(typeof a=='string')a={src:a};this.src=a.src||'';this.url=a.url||null;this.urlTarget=a.target||null;this.addClass=a.addClass||null;this.data=a.data||null;this.$eLI=null;this.parentMenu=null;this.subMenu=null;this.settings=$.extend({},defaults,b);this.active=false;this.enabled=true;this.separator=false;this.init();if(a.subMenu)new $.Menu(this,a.subMenu,b)}});$.extend($.MenuItem,{prototype:{init:function(){var i,isStr,src=this.src,self=this;this.$eLI=$(menuItemElement.cloneNode(1));if(this.addClass)this.$eLI[0].setAttribute('class',this.addClass);if(this.settings.addExpando&&this.data)this.$eLI[0].menuData=this.data;if(src==''){this.$eLI.addClass('menu-separator');this.separator=true}else{isStr=typeof src=='string';if(isStr&&this.url)src=$('<a href="'+this.url+'"'+(this.urlTarget?'target="'+this.urlTarget+'"':'')+'>'+src+'</a>');else if(isStr||!src.length)src=[src];for(i=0;i<src.length;i++){if(typeof src[i]=='string'){elem=document.createElement('span');elem.innerHTML=src[i];this.$eLI[0].firstChild.appendChild(elem)}else this.$eLI[0].firstChild.appendChild(src[i].cloneNode(1))}}this.$eLI.click(function(e){self.click(e,this)});this.bindHover()},click:function(e,a){if(this.enabled&&this.settings.onClick)this.settings.onClick.call(a,e,this)},bindHover:function(){var a=this;this.$eLI.hover(function(){a.hoverIn()},function(){a.hoverOut()})},hoverIn:function(a){this.removeTimer();var i,pms=this.parentMenu.subMenus,pmi=this.parentMenu.menuItems,self=this;if(this.parentMenu.timer)this.parentMenu.removeTimer();if(!this.enabled)return;for(i=0;i<pmi.length;i++){if(pmi[i].active)pmi[i].setInactive()}this.setActive();activeMenu=this.parentMenu;for(i=0;i<pms.length;i++){if(pms[i].visible&&pms[i]!=this.subMenu&&!pms[i].timer)pms[i].addTimer(function(){this.hide()},pms[i].settings.hideDelay)}if(this.subMenu&&!a){this.subMenu.addTimer(function(){this.show()},this.subMenu.settings.showDelay)}},hoverOut:function(){this.removeTimer();if(!this.enabled)return;if(!this.subMenu||!this.subMenu.visible)this.setInactive()},removeTimer:function(){if(this.subMenu){this.subMenu.removeTimer()}},setActive:function(){this.active=true;this.$eLI.addClass('active');var a=this.parentMenu.parentMenuItem;if(a&&!a.active)a.setActive();activeItem=this},setInactive:function(){this.active=false;this.$eLI.removeClass('active');if(this==activeItem)activeItem=null},enable:function(){this.$eLI.removeClass('disabled');this.enabled=true},disable:function(){this.$eLI.addClass('disabled');this.enabled=false},destroy:function(){this.removeTimer();this.$eLI.remove();this.$eLI.unbind('mouseover').unbind('mouseout').unbind('click');if(this.subMenu){this.subMenu.destroy();delete this.subMenu}this.parentMenu.removeItem(this)},addSubMenu:function(b){if(this.subMenu)return;this.subMenu=b;if(this.parentMenu&&$.inArray(b,this.parentMenu.subMenus)==-1)this.parentMenu.subMenus.push(b);if(this.settings.arrowSrc){var a=arrowElement.cloneNode(0);a.setAttribute('src',this.settings.arrowSrc);this.$eLI[0].firstChild.appendChild(a)}}}});$.extend($.fn,{menuFromElement:function(c,d,e){var f=function(a){var b=[],subItems,menuItem,lis,$li,i,subUL,submenu,target,classNames=null;lis=j(a,'LI');for(i=0;i<lis.length;i++){subItems=[];if(!lis[i].childNodes.length){b.push(new $.MenuItem('',c));continue}if((subUL=h(lis[i],'UL'))){subItems=f(subUL);$(subUL).remove()}$li=$(lis[i]);if($li[0].childNodes.length==1&&$li[0].childNodes[0].nodeType==3)target=$li[0].childNodes[0].nodeValue;else target=$li[0].childNodes;if(c&&c.copyClassAttr)classNames=$li.attr('class');menuItem=new $.MenuItem({src:target,addClass:classNames},c);b.push(menuItem);if(subItems.length)new $.Menu(menuItem,subItems,c)}return b};return this.each(function(){var a,m;if(d||(a=h(this,'UL'))){a=d?$(d).clone(true)[0]:a;menuItems=f(a);if(menuItems.length){m=new $.Menu(this,menuItems,c);if(e)e.addMenu(m)}$(a).hide()}})},menuBarFromUL:function(a){return this.each(function(){var i,lis=j(this,'LI');if(lis.length){bar=new $.MenuCollection();for(i=0;i<lis.length;i++)$(lis[i]).menuFromElement(a,null,bar)}})},menu:function(a,b){return this.each(function(){if(b&&b.constructor==Array)new $.Menu(this,b,a);else{if(this.nodeName.toUpperCase()=='UL')$(this).menuBarFromUL(a);else $(this).menuFromElement(a,b)}})}});var h=function(a,b){if(!a)return null;var n=a.firstChild;for(;n;n=n.nextSibling){if(n.nodeType==1&&n.nodeName.toUpperCase()==b)return n}return null};var j=function(a,b){if(!a)return[];var r=[],n=a.firstChild;for(;n;n=n.nextSibling){if(n.nodeType==1&&n.nodeName.toUpperCase()==b)r[r.length]=n}return r}})(jQuery);