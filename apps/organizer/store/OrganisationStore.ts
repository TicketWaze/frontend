import Organisation from '@/types/Organisation'
import {Store} from '@tanstack/react-store'

const organisationStore = new Store({state : {organisation : undefined} as {organisation : Organisation | undefined}})

export default organisationStore