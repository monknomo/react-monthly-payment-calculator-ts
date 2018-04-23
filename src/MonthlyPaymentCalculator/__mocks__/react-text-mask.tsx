import * as React from 'react';

export default class MaskedInput extends React.Component<{},{}>{

  constructor(props: any){
    super(props);
  }

  public render(){
    return (
      <input {...this.props}/>
    )
  }
}
