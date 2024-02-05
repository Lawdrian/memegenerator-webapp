import React from 'react';
import { Table, Box, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { formatTime } from '../utils/timeUtils';
import { deleteDraft } from '../api/draft';

const MyDrafts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const drafts = useSelector((state) => state.draft.drafts);
  const token = useSelector((state) => state.user.token);

  const handleEdit = (draft) => {
      navigate(`/editor/${draft._id}`)
  };

  const handleDelete = (draft) => {
      dispatch(deleteDraft(draft._id, token))
  };

  return (
    <div>
        <h1>My Drafts</h1>
        <Box maxWidth="1000px">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ borderBottom: '3px solid black' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Draft Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Edit</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drafts && drafts.map((draft) => (
                <TableRow key={draft._id}>
                  <TableCell>{draft.name}</TableCell>
                  <TableCell>{formatTime(draft.createdAt)}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(draft)}>
                        Edit Draft
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(draft)}>
                        Delete Draft
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </Box>
    </div>
  );
}

export default MyDrafts;