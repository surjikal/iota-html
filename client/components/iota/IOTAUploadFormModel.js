import { Form } from 'mobx-react-form';
import validatorjs from 'validatorjs';
import * as _ from 'lodash';


class IOTAUploadFormModel extends Form {

  plugins() {
    return { dvr: validatorjs };
  }

  setup() {
    return {fields:{
        html: {
            label: 'HTML Contents',
            rules: 'required|string',
            options: {
              showErrorsOnChange: true,
              validateOnChange: true,
              validationDebounceWait: 250,
              validationDebounceOptions: { trailing: true }
            }
        }
    }};
  }
}

export default IOTAUploadFormModel;