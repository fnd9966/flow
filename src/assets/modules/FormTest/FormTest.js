import React from 'react';
// import FormFnd from '../../component/form_fnd/form.js';
// import ConfigModal from '../../component/form_fnd/config.js';
import ConfigModalTest from '../../component/form_fnd/test.js';
// import EditableTable from '../../component/form_fnd/zzfTable.js';
class FormTest extends React.Component {
	constructor(props){
        super(props)
        this.state = {
            // detail: false
        }
    }

    render() {
    	return (
			/*<EditableTable></EditableTable>*/
            /*<ConfigModal></ConfigModal>*/
            <ConfigModalTest></ConfigModalTest>
    	)
    }
}
export default FormTest