import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import {observer} from 'mobx-react';


export default observer(({ form }) => (
  <Form onSubmit={form.onSubmit}>
    <p>{form.error}</p>
    <p>{form.$submitting}</p>
    <Form.TextArea style={{fontFamily:'monospace'}} {...form.$('html').bind()} />
    <Form.Button primary onClick={form.onSubmit}>Submit</Form.Button>
  </Form>
));

