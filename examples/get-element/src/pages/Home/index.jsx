import { createElement, useEffect } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';

import './index.css';

import Logo from '../../components/Logo';

export default function Home() {
  useEffect(() => {
    const father1 = document.getElementById('father');
    const father2 = document.querySelector('#father');
    const father3 = document.querySelectorAll('#father');

    console.log('Home -> father1', father1);
    console.log('Home -> father2', father2);
    console.log('Home -> father3', father3);

    const home1 = document.getElementsByClassName('home');
    const home2 = document.querySelector('.home');
    const home3 = document.querySelectorAll('.home');
    console.log('Home -> home1', home1);
    console.log('Home -> home2', home2);
    console.log('Home -> home3', home3);

    const div1 = document.getElementsByTagName('div');
    const div2 = document.querySelector('div');
    const div3 = document.querySelectorAll('div');
    console.log('Home -> div1', div1);
    console.log('Home -> div2', div2);
    console.log('Home -> div3', div3);

    const child = document.getElementById('child1');
    const subDiv1 = child.getElementsByTagName('div');
    const subDiv2 = child.querySelector('div');
    const subDiv3 = child.querySelectorAll('div');
    console.log('Home -> subDiv1', subDiv1);
    console.log('Home -> subDiv2', subDiv2);
    console.log('Home -> subDiv3', subDiv3);

    const red1 = child.getElementsByClassName('red');
    const red2 = child.querySelector('.red');
    const red3 = child.querySelectorAll('.red');
    console.log('Home -> red1', red1);
    console.log('Home -> red2', red2);
    console.log('Home -> red3', red3);
  });
  return (
    <View id="father" className="home">
      <div id="child1" className="son">
        <div className="red"></div>
        <div className="green"></div>
        <div className="red"></div>
      </div>
      <div id="child2" className="son"></div>
      <div id="child3" className="son"></div>
      <div id="child4" className="son"></div>
      <div id="child5" className="son"></div>
    </View>
  );
}
