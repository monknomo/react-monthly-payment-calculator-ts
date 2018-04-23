import * as React from 'react';

export default class MaskedInput extends React.Component<{},{}>{

constructor(props: any){
  super(props);
}

render(){
  return (
    <input {...this.props}/>
  )
}
}
