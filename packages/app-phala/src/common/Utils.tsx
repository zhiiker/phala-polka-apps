
import React from 'react';
import styled from 'styled-components';
import { Grid, Table } from 'semantic-ui-react';

import CID from 'cids';
import multihashing from 'multihashing';

export function genTablePreview (header: Array<string> | null, rows: Array<Array<string>> | null): React.ReactElement {
  if (!header || !rows) {
    return (<div>暂无预览</div>);
  }
  rows = rows.filter(r => r.length == header.length);
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          {header.map((h, idx) => (<Table.HeaderCell key={idx}>{h}</Table.HeaderCell>))}
        </Table.Row>
      </Table.Header>

      <Table.Body>{
        rows.map((r, ridx) => (
          <Table.Row key={ridx}>{
            r.map((v, vidx) => (
              <Table.Cell key={vidx}>{v}</Table.Cell>
            ))
          }</Table.Row>
        ))
      }</Table.Body>
    </Table>
  )
}

export function genDataLabel (name: string, value: string | React.ReactElement, rightClassName: string = '') {
  return (
    <Grid>
      <Grid.Column width={5}>{name}</Grid.Column>
      <Grid.Column width={11} className={rightClassName}>{value}</Grid.Column>
    </Grid>
  )
}

export function genDataLabels (dict: Array<[string, string]>) {
  return dict.map(([k, v], idx) => (
    <Grid.Column width={5} key={idx}>
      {genDataLabel(k, v)}
    </Grid.Column>
  ))
}

const uploaderGetColor = (props: any) => {
  if (props.isDragAccept) {
      return '#00e676';
  }
  if (props.isDragReject) {
      return '#ff1744';
  }
  if (props.isDragActive) {
      return '#2196f3';
  }
  return '#eeeeee';
}

export const UploadContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => uploaderGetColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
  margin-bottom: 10px;
`;

function readFileAsync(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  })
}

export async function fileToIpfsPath (file: File): Promise<string> {
  const buffer = await readFileAsync(file);
  const hash = multihashing(buffer, 'sha2-256');
  const cid = new CID(0, 'dag-pb', hash);
  return '/ipfs/' + cid.toString();
}