import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
const S=256,C=64,M=256,L=1e6;const F=[0,1,0],B=[0,1,1],A=[0,2,1];
const Z={0:[0,0,0],1:[1,0,1],2:[4,0,1],3:F,4:[0,1,2],5:[0,2,2],6:[0,2,3],7:[0,3,3],16:A,17:A,18:A,19:A,20:A,21:A,22:A,23:B,24:A,25:A,26:A,27:F,28:A,29:A,30:A,32:A,33:A,34:A,48:[2,0,0],49:[2,1,0],50:[2,1,0],51:[2,0,0],52:[0,0,0],64:B,65:[0,2,0],80:F,81:F,82:[0,0,1],83:F};
function run(p:Uint8Array,i:Uint8Array){const d=new Int32Array(S),c=new Int32Array(C),m=new Int32Array(M),o=new Uint8Array(65536);
let sp=0,cp=0,ip=0,pc=0,ol=0,st=0;const f=(e)=>({out:o.slice(0,ol),exit:e});while(1){
if(st===L)return f(10);if(pc<0||pc>=p.length)return f(9);const op=p[pc],z=Z[op];if(!z)return f(5);
const[im,po,pu]=z;if(pc+im>=p.length)return f(9);if(sp<po)return f(2);if(sp-po+pu>S)return f(3);
const nx=pc+1+im;st++;pc=nx;
if(op===0)return f(0);
if(op===1){d[sp++]=(p[nx-1]<<24)>>24;continue}
if(op===2){d[sp++]=p[nx-4]|(p[nx-3]<<8)|(p[nx-2]<<16)|(p[nx-1]<<24);continue}
if(op===3){sp--;continue}
if(op===4){d[sp]=d[sp-1];sp++;continue}
if(op===5){const t=d[sp-1];d[sp-1]=d[sp-2];d[sp-2]=t;continue}
if(op===6){d[sp]=d[sp-2];sp++;continue}
if(op===7){const a=d[sp-3];d[sp-3]=d[sp-2];d[sp-2]=d[sp-1];d[sp-1]=a;continue}
if(op>=0x10&&op<=0x22&&op!==0x17&&op!==0x1b){const b=d[sp-1],a=d[sp-2];let r;
if(op===0x10)r=(a+b)|0;else if(op===0x11)r=(a-b)|0;else if(op===0x12)r=Math.imul(a,b);
else if(op===0x13){if(b===0)return f(4);r=a===-2147483648&&b===-1?a:(a/b)|0;}
else if(op===0x14){if(b===0)return f(4);r=b===-1?0:a%b|0;}
else if(op===0x15){if(b===0)return f(4);r=Math.floor((a>>>0)/(b>>>0))|0;}
else if(op===0x16){if(b===0)return f(4);r=(a>>>0)%(b>>>0)|0;}
else if(op===0x18)r=a&b;else if(op===0x19)r=a|b;else if(op===0x1a)r=a^b;
else if(op===0x1c)r=a<<(b&31);else if(op===0x1d)r=a>>(b&31);else if(op===0x1e)r=(a>>>(b&31))|0;
else if(op===0x20)r=a===b?1:0;else if(op===0x21)r=a<b?1:0;else r=(a>>>0)<(b>>>0)?1:0;
sp-=2;d[sp++]=r;continue}
if(op===0x17){d[sp-1]=-(d[sp-1]|0);continue}
if(op===0x1b){d[sp-1]=~d[sp-1];continue}
if(op===0x30||op===0x31||op===0x32){const rel=((p[nx-2]|(p[nx-1]<<8))<<16)>>16;let tk=!0;
if(op!==0x30){const v=d[--sp];tk=op===0x31?v===0:v!==0;}if(tk)pc=nx+rel;continue}
if(op===0x33){if(cp===64)return f(7);c[cp++]=nx;pc=p[nx-2]|(p[nx-1]<<8);continue}
if(op===0x34){if(cp===0)return f(8);pc=c[--cp];continue}
if(op===0x40){const a=d[sp-1];if(a<0||a>=256)return f(6);d[sp-1]=m[a];continue}
if(op===0x41){const a=d[sp-1],v=d[sp-2];if(a<0||a>=256)return f(6);sp-=2;m[a]=v;continue}
if(op===0x50){const s=String(d[--sp]),b=new TextEncoder().encode(s);if(ol+b.length>65536)return f(11);o.set(b,ol);ol+=b.length;continue}
if(op===0x51){if(ol+1>65536)return f(11);o[ol++]=d[--sp]&255;continue}
if(op===0x52){d[sp++]=ip<i.length?i[ip++]:-1;continue}
if(op===0x53)return f(d[--sp]&255)}
}
for(const id of readdirSync(I).sort()){const p=new Uint8Array(readFileSync(join(I,id,'program.bin')));
const inp=new Uint8Array(readFileSync(join(I,id,'input.bin')));const{out,exit}=run(p,inp);
mkdirSync(join(O,id),{recursive:true});writeFileSync(join(O,id,'stdout.bin'),out);writeFileSync(join(O,id,'exit.txt'),exit+'\n');}
