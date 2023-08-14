import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { UnarchiveOutlined, ArchiveOutlined, DeleteOutlined } from "@mui/icons-material";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IFeedback } from "@/models/Feedback";
import { IconButton } from "@mui/material";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";

interface FeedbackTableProps {
  archived: any;
  _id: string;
  userId: string;
  category: string;
  subject: string;
  comment: string;
  createdAt: string;
}
type props = {
  archived: boolean;
}
function FeedbackArchiveIcon({ archived }: props) {
  return (
    <>
      {archived ? <UnarchiveOutlined /> : <ArchiveOutlined />}
    </>
  );
}
const FeedbackTable = ({
  feedbackList,
  isLoadingFeedbackList,
  refetch,
  page,
  setPage,
  pageSize,
  setPageSize,
  rowCountState,
}: {
  feedbackList: (IFeedback & Required<{ _id: string }>)[];
  isLoadingFeedbackList: boolean;
  refetch: () => Promise<void>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  rowCountState: number;
}) => {
  const { mutate } = api.data.deleteFeedbackById.useMutation();
  const { mutate: mutateFeedback } = api.data.archiveFeedbackById.useMutation();
  const columns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      editable: false,
      renderCell: (params) => {
        const data = params.row as FeedbackTableProps;
        return (
          <Typography fontSize={14} fontWeight={"bold"}>
            {new Date(data?.createdAt).toLocaleString()}
          </Typography>
        );
      },
    },

    { field: "user", headerName: "User", width: 150, editable: false },
    {
      field: "category",
      headerName: "Category",
      width: 130,
      editable: false,
    },

    {
      field: "Feedback",
      headerName: "Feedback",
      flex: 1,
      renderCell: (params) => {
        const data = params.row as FeedbackTableProps;
        // const onClick = () => {
        //   console.log("done");
        // };

        return (
          <Accordion
            sx={{
              width: "100%",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography fontWeight={"600"}>{data?.subject}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{data?.comment}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      },
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => {
        const data = params.row as FeedbackTableProps;
        const onClickDelete = () => {
          const confirm = window.confirm(
            "Are you sure you want to delete this feedback?"
          );
          if (!confirm) return;
          mutate(
            { feedback_id: data._id },
            {
              onSuccess: () => {
                toast.success("Feedback deleted successfully");
                refetch().catch(console.error);
              },
            }
          );
        };

        const onClickArchive = () => {
          mutateFeedback(
            { feedback_id: data._id },
            {
              onSuccess: () => {
                if (data.archived) {
                  toast.success("Feedback unarchived successfully");
                } else {
                  toast.success("Feedback archived successfully");
                }

                refetch().catch(console.error);
              },
            }
          );
        };

        return (<>
          <IconButton
            style={{ alignSelf: "center", justifySelf: "center" }}
            aria-label="edit"
            onClick={onClickDelete}
          >
            <DeleteOutlined />
          </IconButton>
          <IconButton
            style={{ alignSelf: "center", justifySelf: "center" }}
            aria-label="edit"
            onClick={onClickArchive}
          >
            <FeedbackArchiveIcon archived={data.archived}></FeedbackArchiveIcon>
          </IconButton>
        </>
        );
      },
    },
  ];
  return (
    <Box sx={{ height: "90vh", paddingInline: 2 }}>
      <DataGrid
        rows={feedbackList || []}
        rowCount={rowCountState}
        columns={columns}
        pagination
        page={page}
        onPageChange={(params) => {
          setPage(params);
        }}
        getRowId={(row: { _id: string }) => row?._id}
        pageSize={pageSize}
        onPageSizeChange={(params) => setPageSize(params)}
        rowsPerPageOptions={[10, 20, 40, 80, 100]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        paginationMode="server"
        loading={isLoadingFeedbackList}
        getRowHeight={() => "auto"}
      />
    </Box>
  );
};

export default FeedbackTable;
