<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    // GET /api/events
    public function index()
    {
        return response()->json(Event::with('users')->get());
    }

    // POST /api/events
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        $event = Event::create(array_merge($data, [
            'user_id' => $request->user()->id,
        ]));

        return response()->json([
            'message' => 'Event created successfully',
            'event' => $event
        ], 201);
    }

    // GET /api/events/{id}
    public function show($id)
    {
        $event = Event::with('users')->findOrFail($id);
        return response()->json($event);
    }

    // PUT /api/events/{id}
    public function update(Request $request, $id)
    {
       $event = Event::findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'start_time' => 'sometimes|date',
            'end_time' => 'sometimes|date|after:start_time',
        ]);

        $event->update($data);

        return response()->json([
            'message' => 'Event updated successfully',
            'event' => $event
        ]);
    }

    // DELETE /api/events/{id}
    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }
    public function addUser(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $request->validate(['user_id' => 'required|exists:users,id']);

        $event->users()->attach($request->user_id, ['status' => 'pending']);
        return response()->json(['message' => 'User added to event successfully']);
    }

    public function updateUserStatus(Request $request, $event_id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
           'status' => 'required|in:pending,approved,rejected'
        ]);

    $event = Event::findOrFail($event_id);

    // Provera da li korisnik postoji na događaju
    if (!$event->users()->where('user_id', $request->user_id)->exists()) {
        return response()->json(['message' => 'User is not part of this event'], 404);
    }

    // Ažuriranje statusa u pivot tabeli
    $event->users()->updateExistingPivot($request->user_id, [
        'status' => $request->status
    ]);

    return response()->json(['message' => 'Status updated successfully']);
    }
    public function getUsers($id)
{
    // Pronađi događaj i učitaj njegove korisnike
    $event = Event::with('users')->findOrFail($id);

    // Vrati sve korisnike koji su učesnici tog događaja
    return response()->json($event->users);
}

}
