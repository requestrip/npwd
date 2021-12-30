import { useNuiEvent } from 'fivem-nui-react-lib/';
import { AddNoteExportData, NotesEvents } from '@typings/notes';
import { useApps } from '@os/apps/hooks/useApps';
import { useHistory } from 'react-router';
import qs from 'qs';
import { PhoneApps } from '../../../../../typings/phone';

export const useNoteListener = () => {
  const { getApp } = useApps();
  const history = useHistory();

  const addNoteExportHandler = (noteData: AddNoteExportData) => {
    const { path } = getApp(PhoneApps.NOTES);
    const queryStr = qs.stringify(noteData);

    history.push({
      pathname: path,
      search: `?${queryStr}`,
    });
  };

  useNuiEvent(PhoneApps.NOTES, NotesEvents.ADD_NOTE_EXPORT, addNoteExportHandler);
};
